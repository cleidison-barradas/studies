import { ProductAuthorized } from "../interfaces/pbmAuthorization"
import Product from "../interfaces/product"
import { getProductActivePromotion } from "./getProductActivePromotion"

interface ILowestProductValueDTO {
  product: Product
  authorizedProduct?: ProductAuthorized
}

export const lowestProductValue = ({ product, authorizedProduct }: ILowestProductValueDTO) => {
  const lowestValues: number[] = []

  const pbmToPrice = authorizedProduct && authorizedProduct.approvedQuantity > 0 ? authorizedProduct.salePrice : null

  const specials = getProductActivePromotion(product)

  if (pbmToPrice) lowestValues.push(pbmToPrice)

  if (specials) lowestValues.push(specials.price)

  if (lowestValues.length <= 0) return null

  const lowestPrice = lowestValues.sort((a, b) => a - b)[0]

  return lowestPrice

}
