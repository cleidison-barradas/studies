import { OrderProducts } from "@mypharma/api-core"

export const buildTransactionProduct = (index: number, _product: OrderProducts) => {
  let obj: Record<string, string | number> = {}
  const { product, amount, unitaryValue, promotionalPrice } = _product

  const id = product._id.toString()
  const price = promotionalPrice < unitaryValue ? promotionalPrice.toFixed(2) : unitaryValue.toFixed(2)

  obj[`itemId${index}`] = id
  obj[`itemDescription${index}`] = product.name
  obj[`itemAmount${index}`] = price
  obj[`itemQuantity${index}`] = amount

  return obj
}