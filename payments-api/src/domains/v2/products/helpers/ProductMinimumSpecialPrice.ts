import { Product } from '@mypharma/api-core'
import { ProductSpecialPrice } from './ProductSpecialPrice'

export function getProductSlowerSpecialPrice(product: Product, pbmToPrice?: number) {
  let values: number[] = []

  const special = ProductSpecialPrice(product.specials)

  if (special) values.push(special.price)

  if (pbmToPrice) values.push(pbmToPrice)

  if (values.length <= 0) return null

  values = values.sort((a, b) => a - b)

  const specialPrice = values[0]

  return specialPrice

}