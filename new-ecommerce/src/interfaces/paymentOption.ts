import { PaymentType } from "./PaymentType"

export default interface PaymentOption {
  _id: string
  name: string
  type: PaymentType
  updatedAt?: Date
  createdAt?: Date
  active?: boolean
}
