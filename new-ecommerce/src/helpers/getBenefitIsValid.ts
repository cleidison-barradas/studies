import Product from "../interfaces/product"
import { getProductActivePromotion } from "./getProductActivePromotion"

interface PropsDTO {
  product: Product | null
}

export function getBenefitIsValid({ product = null }: PropsDTO) {

  if (!product) return false

  const { control = null, benefit = null, benefit_sale_price = 0, price } = product

  if (control || !benefit || !benefit_sale_price || benefit_sale_price <= 0) return false

  const specialPrice = getProductActivePromotion(product)

  if (specialPrice && benefit_sale_price >= specialPrice.price) return false

  return benefit_sale_price < price
}
