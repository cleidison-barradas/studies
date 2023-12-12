import { Cupom, Product } from '@mypharma/api-core'
import { endOfDay, isBefore, isWithinInterval } from 'date-fns'

function getProductDiscount(price: number, discount: number) {
  const discountAmount = price * (discount! / 100)
  return price - discountAmount
}

export function getCupomDiscount(product: Product, cupom: Cupom) {
  const price: number = getProductActivePromotion(product) ? getProductActivePromotion(product)?.price! : product.price

  if (cupom.type === 'PRODUCT') {
    if (cupom.allProducts === true && !(cupom.productBlacklist && cupom.productBlacklist.find((value) => value === product.EAN))) {
      return getProductDiscount(price, cupom.descountPercentage)
    } else {
      if (cupom.products?.find((value) => value === product._id)) {
        return getProductDiscount(price, cupom.descountPercentage)
      }
    }
  }
  if (cupom.type === 'CATEGORY') {
    // if product has one of the categorys selected eligible for discount
    if (product.category?.find((value) => cupom.descountCategorys.find((category) => category === value._id))) {
      return getProductDiscount(price, cupom.descountPercentage)
    }
  }
}

export function getProductActivePromotion(product: Product) {
  const { specials = [] } = product

  return specials.find(({ date_end = endOfDay(new Date()), date_start }) => {
    if (!date_end) {
      return isBefore(new Date(date_start), new Date())
    }
    return isWithinInterval(new Date(), { start: new Date(date_start), end: new Date(date_end) })
  })
}

export const getProductPrice = (price: number, promotional: number = 0, cupomDiscount?: number) => {
  if (promotional && cupomDiscount) {
    if (promotional > cupomDiscount) return cupomDiscount
    else return promotional
  }
  if (promotional && !cupomDiscount) return promotional
  if (!promotional && cupomDiscount) return cupomDiscount

  return price
}
