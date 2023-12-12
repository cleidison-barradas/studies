import Customer from './customer'
import PaymentMethod from './paymentMethod'
import Product from './product'
import StatusOrder from './statusOrder'
import { DeliveryMode } from './deliveryMode'
import DeliveryFee from './deliveryFee'
import { IPaymentCode } from './paymentCode'
import { StoreBranchPickup } from './storeBranchPickup'

interface OrderProducts {
  product: Product
  amount: number
  unitaryValue: number
  promotionalPrice: number
}

export default interface Order {
  _id?: string
  customer: Customer
  deliveryData?: DeliveryFee
  clientIP: string
  cpf?: string
  userAgent: string
  installedApp?: boolean
  comment: string
  paymentMethod: PaymentMethod
  paymentCode: IPaymentCode
  relatedOrderId?: string
  prefix: string
  totalOrder: number
  paymentCustomField: any
  statusOrder: StatusOrder
  moneyChange: number
  orderTotals: any[]
  extras: any[]
  healthInsurance: any
  deliveryMode: DeliveryMode
  shippingOrder: any
  products: OrderProducts[]
  trackingCode?: string
  branchPickup: StoreBranchPickup
  createdAt?: Date
  updatedAt?: Date
}
