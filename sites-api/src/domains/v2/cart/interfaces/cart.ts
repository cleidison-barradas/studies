import { Product } from '@mypharma/api-core'

export interface CartProductsRequest {
  quantity: number
  product: Product
}

export interface CartProducts {
  id: string
  name: string
  slug: string
  quantity: number
  maxQuantity: number
}