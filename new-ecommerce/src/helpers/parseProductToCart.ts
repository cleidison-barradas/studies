import Product from '../interfaces/product'

export function parseProductToCart(product: Product, quantity: number = 1) {
  const { _id, name, model, price, quantity: maxQuantity } = product
  return {
    id: _id as string,
    name,
    model,
    price,
    maxQuantity,
    quantity,
  }
}
