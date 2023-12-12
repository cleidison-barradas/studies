import { CartProductsRequest, CartProducts } from '../interfaces/cart'

export function parserProducts(products: CartProductsRequest[]): CartProducts[] {

  return products.map(_product => {
    const { quantity, product } = _product
    const { name, _id, slug, price } = product

    const id = _id.toString()

    return {
      id,
      name,
      price,
      slug: slug[0],
      quantity,
      maxQuantity: product.quantity
    }
  })
}