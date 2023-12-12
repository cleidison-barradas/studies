import RemarketingExecuteTaskService from "./RemarketingExecuteTaskService"
import GetCustomerNotificationService from "./GetCustomerNotificationService"
import { ProcessNotifications, UpdateNotification } from "../helpers/NotificationsHelper"

const remarketingExecuteTaskService = new RemarketingExecuteTaskService()
const getCustomerNotificationService = new GetCustomerNotificationService()

export const NotificationCustomerService = async () => {
  try {
    const notifications = await getCustomerNotificationService.getCustomerNotifications({ process: 'pending' })

    if (notifications.length <= 0) return

    for await (const entry of notifications) {
      const processed = await ProcessNotifications(entry);

      if (processed !== 0) {
        await UpdateNotification(entry._id.toString(), "sent");
      }
    }

    await remarketingExecuteTaskService.executeRemarketingTasks({ type: 'NOTIFICATION', channel: 'EMAIL', status: 'PENDING' })

  } catch (error) {
    console.log(error)
  }
}
