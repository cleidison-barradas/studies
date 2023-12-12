import { siteApi } from '../../config/api'
import { handleErrorResponse } from '../../helpers/handleErrorResponse'
import { GetProductResponse, GetRelatedProductsResponse } from './response.interface'

export function loadProduct(query?: string, isVirtual?: boolean) {
  return siteApi
    .get<GetProductResponse>('/v2/product', { slug: query, ...(isVirtual ? { v: 1 } : {}) })
    .then((res) => res.data)
    .catch(handleErrorResponse)
}

export function getRelatedProducts(ean: string) {
  return siteApi
    .get<GetRelatedProductsResponse>('/v2/product/related', { ean })
    .then((res) => res.data)
    .catch(handleErrorResponse)
}

export async function GetMostPurchased() {
  return siteApi.get<GetRelatedProductsResponse>('/v2/product/most/purchased').then(res => res.data).catch(handleErrorResponse)

}
