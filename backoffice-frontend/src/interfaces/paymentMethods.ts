import PaymentOption from './paymentOption'

export default interface PaymentMethods {
    _id?: string
    paymentOption: PaymentOption
    extras: any[]
    updatedAt?: Date
    createdAt?: Date
}
