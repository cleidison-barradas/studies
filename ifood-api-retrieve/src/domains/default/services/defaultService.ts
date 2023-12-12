import { schedule } from 'node-cron'
import { ifoodService } from '../../ifood/services/ifood.service'
import { orderService } from '../../orders/services/order.service'

export const defaultService = () => {
  ifoodService()
  // schedule('*/5 * * * *', orderService)
  // schedule('*/15 * * * *', ifoodService)
}