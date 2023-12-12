export function parseProductToCart(products: any) {
  return products.map(({ product, quantity }: any) => {
    const { _id, name, model, price } = product
    return {
      id: _id,
      name,
      model,
      price,
      quantity,
      maxQuantity: product.quantity,
    }
  })
}
