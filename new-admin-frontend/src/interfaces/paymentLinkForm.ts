import Product from './product'

export default interface PaymentLinkForm {
  products?: {
    product: Product
    amount: number
  }[]
  deliveryFee?: number | null
  total?: number
  storeUrl: string
}
