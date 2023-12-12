import Details from "./PaymentDetails"
import PaymentOption from "./paymentOption"
import InstallmentsDetails from './installmentsDetails'

export default interface PaymentMethod {
  _id?: string,
  extras: any[],
  paymentOption: PaymentOption,
  installmentsDetails?: InstallmentsDetails
  details: Details,
  updatedAt?: Date,
  createdAt?: Date,
  active?: boolean
}
