import Cart from '../../interfaces/cart'
import Product from '../../interfaces/product'

export interface CartLink extends Omit<Cart, 'products'> {
  products: Product[] | { product?: Product; quantity?: number | undefined }[]
}

export interface LoadPaymentLinkByFingerprintResponse {
  cart?: CartLink
  deliveryFee?: number
  message?: string
}
