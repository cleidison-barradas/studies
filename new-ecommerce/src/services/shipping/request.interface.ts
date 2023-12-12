import { ISender } from '../../interfaces/sender'
import { IShippingProducts } from '../../interfaces/shippingProducts'

export interface PostShippingRequest {
  zipcode?: string
  sender: ISender
  products: IShippingProducts[]
}
