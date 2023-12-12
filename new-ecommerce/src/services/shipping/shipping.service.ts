import { shippingApi } from '../../config/api'
import { CartProduct } from '../../interfaces/cart'
import { PostShippingRequest } from './request.interface'
import { PostShippingResponse } from './response.interface'

export async function calculateShipping(data: PostShippingRequest) {
  return shippingApi
    .post<PostShippingResponse>('/v1/shipping', data)
    .then((response) => response.data)
}

export function parseProductsToShipping(data: CartProduct[]) {
  return data.map((value) => ({
    id: value.product._id,
    name: value.product.name,
    quantity: value.quantity,
    price: value.product.price,
    updateOrigin: value.product.updateOrigin,
    slug: value.product.slug.pop() || '',
  }))
}
