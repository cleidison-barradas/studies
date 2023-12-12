import { siteApi } from '../../config/api'
import Category from '../../interfaces/category'
import {
  GetCategoryManufacturersResponse,
  GetCategoryProductsByNameResponse,
  GetCategoryProductsResponse,
  GetCategoryResponse,
} from './response.interface'

export async function getCategory(populated?: boolean) {
  return siteApi.get<GetCategoryResponse>('/v2/category', { populated }).then((res) => res.data)
}

export async function getCategoryProducts(categorys: string[]) {
  return siteApi
    .post<GetCategoryProductsResponse>(`/v2/category/products`, { ids: categorys })
    .then((res) => res.data)
}

export async function getCategoryProductsByName({
  name,
  filter,
  limit,
  categoryId,
  manufacturers,
}: any) {
  return siteApi
    .get<GetCategoryProductsByNameResponse>(`/v2/category/products/${categoryId}`, {
      filter,
      limit,
      name,
      manufacturers,
    })
    .then((res) => res.data)
}

export async function getCategoryManufacturers(id: Category['_id']) {
  return siteApi.get<GetCategoryManufacturersResponse>(`/v2/category/manufacturer/${id}`)
}
