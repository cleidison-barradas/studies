import Cupom from './cupom'
import Customer from './customer'
import DeliveryFee from './deliveryFee'
import { deliveryMode } from './deliveryMode'
import { NfeData } from './nfe'
import OrderStatus from './orderStatus'
import orderTotals from './orderTotals'
import PaymentMethods from './paymentMethods'
import ProductOrder from './productOrder'
import { ISender } from './sender'
import ShippingOrder from './shippingData'
import { StoreBranchPickup } from './storeBranchPickup'

export type PaymentCode = 'pay_online' | 'pay_on_delivery'

export default interface Order {
  stock: string
  _id?: string
  prefix?: string
  comment?: string
  sender: ISender
  clientIP?: string
  cpf: string | null
  totalOrder: number
  paymentCode: PaymentCode
  moneyChange?: number
  products: ProductOrder[]
  deliveryData: DeliveryFee | null
  statusOrder: OrderStatus
  customer: Customer | null
  orderTotals?: orderTotals[]
  paymentMethod: PaymentMethods
  deliveryMode: deliveryMode
  shippingOrder?: ShippingOrder
  trackingCode?: string
  healthInsurance?: string
  nfe_data?: NfeData
  shippingData?: Record<string, any>
  externalMarketplace?: {
    name?: string
  }
  createdAt?: Date
  updatedAt?: Date
  cupom: Cupom
  branchPickup: StoreBranchPickup
  relatedOrderId?: string
}