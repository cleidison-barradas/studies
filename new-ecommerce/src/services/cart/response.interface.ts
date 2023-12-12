import Cart from '../../interfaces/cart'

export interface LoadCartByFingerprintResponse {
  cart: Cart
}
export interface SaveCartResponse {
  cart: Cart
  error?: string
}

export interface RemarketingResponse {
  send: boolean
}
