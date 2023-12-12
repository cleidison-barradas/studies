import { Product } from '@mypharma/api-core'
import { getProductActivePromotion } from './getProductPromotion'

export default function getLowerProductPrice(product: Product) {
  const { price } = product

  const special = getProductActivePromotion(product)?.price || 999999999999999

  return Math.min(price, special)

}