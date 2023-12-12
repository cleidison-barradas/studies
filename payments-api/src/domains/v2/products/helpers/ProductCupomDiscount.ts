import { Cupom, Product } from '@mypharma/api-core'
import { ProductDiscountPercentage } from './ProductDiscountPercentage'

export function ProductCupomDiscount(product: Product, cupom?: Cupom) {
  if (!cupom) return null

  const { type, allProducts = true, descountPercentage = 0, descountCategorys = [], productBlacklist = [], products = [] } = cupom
  const { category = [], price } = product

  if (type === 'PRODUCT') {
    if (allProducts && !productBlacklist.includes(product.EAN)) {
      return ProductDiscountPercentage(price, descountPercentage)
    } else {
      if (products.includes(product._id)) {
        return ProductDiscountPercentage(price, descountPercentage)
      }
    }
  }

  if (type === 'CATEGORY' && category && category.length > 0) {
    const hasCategoryElegible = category.filter((_category) => descountCategorys.includes(_category._id)).length > 0

    if (hasCategoryElegible) {
      return ProductDiscountPercentage(price, descountPercentage)
    }
  }

  return price
}
