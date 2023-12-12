import { ObjectID, RemarketingChannel, RemarketingRepository, RemarketingStatus } from "@mypharma/api-core"
import { RemarketingType } from "../../../interfaces/remarketing_types"
import SendGridPlugin from "../../../plugins/sendGrid"
import templateId from '../../../config/templates/emails'

const sendGridPlugin = new SendGridPlugin()

interface RemarketingExecuteTaskServiceDTO {
  type: RemarketingType
  status: RemarketingStatus
  channel: RemarketingChannel
}

class RemarketingExecuteTaskService {
  constructor(private repository?: any) { }

  public async executeRemarketingTasks({ type, channel, status }: RemarketingExecuteTaskServiceDTO) {
    const bulkWriteUpdateTask: any[] = []
    const bulkSendEmails = sendGridPlugin.getBulkSendEmails()

    const tasks = await RemarketingRepository.repo().find({
      where: {
        status,
        channel
      }
    })

    if (tasks.length <= 0) return

    tasks.forEach(task => {
      const _id = new ObjectID(task._id.toString())
      delete task._id

      if (type === 'MISS-YOU') {

        bulkSendEmails.push({
          to: task.customer.email,
          from: {
            name: task.store.name,
            email: task.store.storeEmail
          },
          dynamicTemplateData: {
            store: task.store,
            customer: task.customer,
            ...task.dynamicContent
          },
          customArgs: {
            storeId: task.store.storeId.toString()
          },
          templateId: templateId.missYouTemplate
        })

      }

      if (type === 'RECENT-CART') {

        bulkSendEmails.push({
          to: task.customer.email,
          from: {
            name: task.store.name,
            email: task.store.storeEmail
          },
          dynamicTemplateData: {
            store: task.store,
            customer: task.customer,
            products: task.products,
            ...task.dynamicContent
          },
          customArgs: {
            storeId: task.store.storeId.toString()
          },
          templateId: templateId.cartTemplate
        })
      }

      if (type === 'NOTIFICATION') {
        bulkSendEmails.push({
          to: task.customer.email,
          subject: task.dynamicContent.subject,
          from: {
            name: task.store.name,
            email: task.store.storeEmail
          },
          dynamicTemplateData: {
            store: task.store,
            ...task.dynamicContent
          },
          customArgs: {
            storeId: task.store.storeId.toString()
          },
          templateId: templateId.customerTemplate
        })
      }

      const storeId = new ObjectID(task.store.storeId.toString())

      bulkWriteUpdateTask.push({
        updateOne: {
          filter: { _id },
          update: {
            '$set': {
              ...task,
              store: {
                ...task.store,
                storeId
              },
              customer: {
                ...task.customer,
                _id: new ObjectID(task.customer._id.toString())
              },
              status: 'SENT',
              updatedAt: new Date(),
            }
          },
        }
      })
    })

    if (bulkWriteUpdateTask.length > 0) {

      await sendGridPlugin.SendMail()

      await RemarketingRepository.repo().bulkWrite(bulkWriteUpdateTask)
    }
  }
}

export default RemarketingExecuteTaskService