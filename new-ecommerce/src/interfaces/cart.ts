import Cupom from './cupom'
import Product from './product'

type IOriginPathType = 'search' | 'showcase' | 'categories'

export interface CartProduct {
  product: Product
  quantity: number
  origin?: IOriginPathType
}

export default interface Cart {
  _id?: string
  cupom: Cupom | null
  customerId?: string
  products: CartProduct[]
  fingerprint: string | null
}
