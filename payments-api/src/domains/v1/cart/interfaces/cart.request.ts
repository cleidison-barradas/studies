import { ObjectId } from "bson";

export type IPurchased = 'YES' | 'NO'

export interface IPutCartRequest {
  products: [
    {
      id: string
      price: number
      slug: string
      model: string
      name: string
      quantity: number
      maxQuantity: number
    }
  ]
  code: string
  fingerprint?: string
  user?: any
}

export interface PostAddSingleRequest {
  customer_id: string
  fingerprint: string
  origin: 'product-detail' | 'search-result'
  product_ean: string
}

interface CartProducts {
  id: ObjectId
  name: string
  slug: string
  quantity: number
  maxQuantity: number
}

export interface PutSendCartRequest {
  products: CartProducts[]
  purchased: IPurchased
}