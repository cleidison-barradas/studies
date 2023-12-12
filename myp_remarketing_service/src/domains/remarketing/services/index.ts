import { schedule } from 'node-cron'
import { MissYouService } from "./MissYouService"
import { RecentCartService } from "./RecentCartService"
import { NotificationCustomerService } from './NotificationCustomerService'

export default async () => {
  schedule("30 07 * * *", MissYouService)
  schedule("*/1 * * * *", RecentCartService)
  schedule("*/1 * * * *", NotificationCustomerService)
}