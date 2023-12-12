import Product from './product'

export default interface PaymentLink {
  _id?: string
  fingerprint?: string
  deliveryFee?: number
  total: number
  link: string
  cartId: string
  createdAt?: Date
  updatedAt?: Date
}
