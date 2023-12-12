import { CartProductRequest } from "@mypharma/api-core";
import { RecentCartProducts } from "../../../interfaces/recentecartproducts";
import moneyFormat from "./moneyFormat";
import { specialPrice } from "./SpecialPrice";
import bucketConfig from '../../../config/buckets3'

export const getRecentCartProducts = (cartProducts: CartProductRequest[]) => {
  const products: RecentCartProducts[] = []

  if (cartProducts.length <= 0) return products

  cartProducts.forEach(cartProduct => {
    const name = cartProduct.product.name
    const quantity = cartProduct.quantity
    const special = specialPrice(cartProduct.product.specials)
    const price = moneyFormat(special ? special.price : cartProduct.product.price)
    const image = new URL(cartProduct.product.image ? cartProduct.product.image.url : bucketConfig.noImageMockup, bucketConfig.bucket).href

    products.push({
      name,
      price,
      image,
      quantity
    })

  })

  return products
}