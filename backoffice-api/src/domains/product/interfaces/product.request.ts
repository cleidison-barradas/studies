import { Product } from '@mypharma/api-core'

export interface IGetProductRequest {
  limit?: number
  page?: number
  name?: string
  start?: Date
  end?: Date
  updatedAt?: string
  others?: string
  category?: string
}

export interface IPostProductRequest {
  tenant?: string
  product: Product
}

export interface IPostUpdateStoreProductsControlRequest{
  tenant: string
}