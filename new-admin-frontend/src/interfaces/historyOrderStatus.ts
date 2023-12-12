import Order from './order'
import OrderStatus from './orderStatus'

export default interface HistoryOrder {
  _id?: string,
  notify: boolean,
  status: OrderStatus,
  comments?: string,
  order: Order,
  createdAt: Date,
  updatedAt: Date
}