import { ProductAuthorized } from '../interfaces/pbmAuthorization'
import Product from '../interfaces/product'
import { getPbmDiscount } from './getPbmDiscount'
import { getProductActivePromotion } from './getProductActivePromotion'

export const getProductSlowerSpecial = (product: Product, pbmProduct?: ProductAuthorized) => {
  let values: number[] = []

  const pbmDiscount = getPbmDiscount(pbmProduct)

  const special = getProductActivePromotion(product)

  if (special) values.push(special.price)

  if (pbmDiscount) values.push(pbmDiscount)

  values = values.filter((v) => typeof v !== 'undefined').sort((a, b) => a - b)

  const specialPrice = values[0]

  return specialPrice
}
