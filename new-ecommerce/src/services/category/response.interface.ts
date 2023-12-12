import Category from '../../interfaces/category'
import Manufacturer from '../../interfaces/manufacturer'
import Product from '../../interfaces/product'

export interface GetCategoryResponse {
  categorys: Category[]
}

export interface GetCategoryProductsResponse {
  products: Product[]
}

export interface GetCategoryProductsByNameResponse {
  products: Product[]
  count: number
}

export interface GetCategoryManufacturersResponse {
  manufacturers: Manufacturer[]
}
