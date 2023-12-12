import Product from '../../interfaces/product'

export interface GetProductResponse {
  product: Product
}

export interface GetRelatedProductsResponse {
  products: Product[]
}
