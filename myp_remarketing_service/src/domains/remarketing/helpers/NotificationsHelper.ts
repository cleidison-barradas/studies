import { logger, NotificationCustomer, NotificationCustomerRepository, ObjectID, ORM, RemarketingRepository, StoreRepository } from "@mypharma/api-core"
import { ObjectId } from "bson"
import { GetCustomers } from "./CustomerHelpers"
import * as AllHtmlEntities from 'html-entities'

export async function ProcessNotifications(notification: NotificationCustomer) {
  const store = await StoreRepository.repo().findById(notification.storeId)
  const BulkWriteTasks = []

  if (store) {
    await ORM.setup(null, store.tenant)
    const customers = await GetCustomers(store.tenant)

    logger(`retrieving settings from ${store.name} send emails to ${customers.length} customers`)
    if (customers.length > 0) {
      for (const customer of customers) {

        const email = customer.email
        const fullName = customer.fullName

        const store_name = store.name
        const store_url = new URL(store.url).href
        const storeId = new ObjectID(store._id.toString())
        const storeEmail = String(store.settings['config_email'])
        const color = String(store.settings['config_navbar_color'])
        const unsubscribe = new URL(`/unsubscribe/${email}`, store.url).href
        const store_phone = String(store.settings['config_phone']).replace(/\D/g, '')
        const store_whatsapp = String(store.settings['config_whatsapp_phone']).replace(/\D/g, '')

        const message = AllHtmlEntities.decode(notification.message.
          replace(/\{{ customer_name }}/g, fullName).
          replace(/\{{ store_url }}/g, store_url).
          replace(/\{{ store_name }}/g, store_name).
          replace(/\{{ store_phone }}/g, store_phone).
          replace(/\{{ store_whatsapp }}/g, store_whatsapp))

        const subject = notification.subject.
          replace(/\{{ customer_name }}/g, fullName).
          replace(/\{{ store_url }}/g, store_url).
          replace(/\{{ store_name }}/g, store_name).
          replace(/\{{ store_phone }}/g, store_phone).
          replace(/\{{ store_whatsapp }}/g, store_whatsapp)

        BulkWriteTasks.push({
          insertOne: {
            'document': {
              customer,
              channel: "EMAIL",
              status: 'PENDING',
              type: 'NOTIFICATION',
              products: [],
              store: {
                color,
                storeId,
                storeEmail,
                unsubscribe,
                name: store_name,
              },
              dynamicContent: {
                message,
                subject
              },
              sendAt: new Date(),
              createdAt: new Date(),
            }
          }
        })
      }

      if (BulkWriteTasks.length > 0) {
        await RemarketingRepository.repo().bulkWrite(BulkWriteTasks)
      }
    }
  }

  return BulkWriteTasks.length
}

export function UpdateNotification(_id: string, process: string) {

  return NotificationCustomerRepository.repo().updateOne({ _id: new ObjectId(_id) }, { $set: { process } })

}


