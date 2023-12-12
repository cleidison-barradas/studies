import Customer from './customer'
import OrderStatus from './orderStatus'

export default interface OrderHistory {
    order: string
    authorType: string
    costumer: Customer
    admin: any
    oldStatus: OrderStatus
    newStatus: OrderStatus
    comments: string
    createdAt?: Date
    updatedAt?: Date
}
