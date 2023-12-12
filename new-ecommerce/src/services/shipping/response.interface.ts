import { IShipping } from '../../interfaces/shipping'
import { IAddress } from '../../interfaces/shippingAddress'

export interface PostShippingResponse {
  shipping: {
    address: IAddress
    shipping: IShipping[]
  }
}
