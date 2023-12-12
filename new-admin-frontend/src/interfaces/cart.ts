import Product from './product'

export default interface Cart {
  _id?: string
  fingerprint?: string
  products: { product: Product; quantity: number }[]
}
