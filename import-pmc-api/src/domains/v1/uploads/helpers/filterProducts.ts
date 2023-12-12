import { IProduct } from "../../../../interfaces/product";

export const filter = (products: IProduct[] = []) => {
  const entries = new Map<string, IProduct>([])

  products.filter(product =>
    (typeof product.name !== 'undefined' && product.name.length > 0) &&
    (typeof product.EAN !== 'undefined' && product.EAN.length > 0) &&
    (typeof product.quantity !== 'undefined') &&
    (typeof product.price !== 'undefined'))

    .forEach(_product => {

      if (!entries.has(_product.EAN.toString())) {
        entries.set(_product.EAN.toString(), _product)
      }
    })

  const filtred = Array.from(entries.values())

  return filtred
}

export const filterProductsToPromotion = (products: IProduct[] = []) => {
  const entries = new Map<string, IProduct>([])

  const filtred = products.filter(product =>
    (typeof product.EAN !== 'undefined') &&
    (typeof product.price !== 'undefined'))

  filtred.forEach(item => {
    if (!entries.has(item.EAN)) {
      entries.set(item.EAN, item)
    }
  })

  return entries
}
