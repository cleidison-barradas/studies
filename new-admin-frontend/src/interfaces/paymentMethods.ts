import PaymentOption from './paymentOption'
import Details from './Details'
import InstallmentsDetails from './installmentsDetails'

export default interface PaymentMethods {
  _id?: string,
  extras: any[],
  paymentOption: PaymentOption,
  installmentsDetails?: InstallmentsDetails
  details?: Details
  updatedAt?: Date,
  createdAt?: Date,
  active?: boolean
}
