import { Product, Cupom } from '@mypharma/api-core'

function getProductDiscount(price: number, discount: number) {
  const discountAmount = price * (discount / 100)
  return price - discountAmount
}

export function getCupomDiscount(product: Product, cupom: Cupom) {
  if (cupom.type === 'PRODUCT') {
    if (cupom.allProducts === true && !(cupom.productBlacklist && cupom.productBlacklist.find((value) => value === product.EAN))) {
      return getProductDiscount(product.price, cupom.descountPercentage)
    } else {
      if (cupom.products?.find((value) => value === product._id)) {
        return getProductDiscount(product.price, cupom.descountPercentage)
      }
    }
  }
  if (cupom.type === 'CATEGORY') {
    // if product has one of the categorys selected eligible for discount
    if (product.category?.map((value) => cupom.descountCategorys.find((category) => category === value._id))) {
      return getProductDiscount(product.price, cupom.descountPercentage)
    }
  }
}
