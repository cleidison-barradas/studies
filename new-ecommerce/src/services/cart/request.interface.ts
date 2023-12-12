import { CartProduct } from '../../interfaces/cart'
import { IPurchased } from '../../interfaces/remarketing'

export interface IRemarketingRequest {
  purchased: IPurchased
  products: CartProduct[]
}

interface CartRequestDTO {
  _id: string
  quantity: number
}

export interface CartRequest {
  cart: CartRequestDTO[]
}
