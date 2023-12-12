import Customer from './customer'
import DeliveryFee from './deliveryFee'
import OrderStatus from './orderStatus'
import ProductOrder from './productOrder'

export default interface Order {
    _id?: string
    prefix?: string
    comment?: string
    clientIP?: string
    products: ProductOrder[]
    totalOrder: number
    deliveryData: {
        deliverFeeID: DeliveryFee
        deliveryFee: number
        deliveryTime: number
    }
    statusOrder: OrderStatus
    customer: Customer
    createdAt?: Date
    updatedAt?: Date
}
