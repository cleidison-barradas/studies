import Cupom from '../interfaces/cupom'
import { ProductAuthorized } from '../interfaces/pbmAuthorization'
import Product from '../interfaces/product'
import { getProductActivePromotion } from './getProductActivePromotion'

function getProductDiscount(price: number, discount: number) {
  const discountAmount = price * (discount / 100)
  return price - discountAmount
}

export function getCupomDiscount(product: Product, cupom: Cupom, fromPaymentLink?: boolean, pbmProduct?: ProductAuthorized) {
  const {
    type = 'PRODUCT',
    allProducts = false,
    productBlacklist = [],
    products = [],
    descountCategorys = [],
  } = cupom
  const { category = [] } = product

  let price = Number(product.price)

  const special = getProductActivePromotion(product)

  if (special && !fromPaymentLink) price = Number(special.price)

  if (pbmProduct && !fromPaymentLink) price = Number(pbmProduct.salePrice)

  if (type.includes('PRODUCT')) {
    if (allProducts && !productBlacklist.includes(product.EAN)) {
      return getProductDiscount(price, cupom.descountPercentage)
    } else {
      if (products.includes(product._id)) {
        return getProductDiscount(price, cupom.descountPercentage)
      }
    }
  }

  if (type.includes('CATEGORY') && category.length > 0) {
    // if product has one of the categorys selected eligible for discount
    const hasCategoryElegible =
      category.filter((_category) => descountCategorys.includes(_category._id!)).length > 0

    if (hasCategoryElegible) {
      return getProductDiscount(price, cupom.descountPercentage)
    }
  }

  return undefined
}
