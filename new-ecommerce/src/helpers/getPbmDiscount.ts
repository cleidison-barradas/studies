import { ProductAuthorized } from "../interfaces/pbmAuthorization"

export function getPbmDiscount(pbmProduct?: ProductAuthorized | null) {
  let discount: number | null = null

  if (pbmProduct) {
    discount = pbmProduct.salePrice
  }

  return discount
}
