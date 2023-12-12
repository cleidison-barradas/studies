import { Customer, PaymentMethod, OrderProducts, StatusOrder } from "@mypharma/api-core"
import { IDeliveryMode } from "../../../../interfaces/deliveryMode"
import { IPaymentCode } from "../../../../interfaces/paymentCode"

export interface IOrderBasicFields {
  tenant: string
  customer: Customer
  statusOrder: StatusOrder
  products: OrderProducts[]
  paymentCode: IPaymentCode
  deliveryMode: IDeliveryMode
  paymentMethod: PaymentMethod
}

