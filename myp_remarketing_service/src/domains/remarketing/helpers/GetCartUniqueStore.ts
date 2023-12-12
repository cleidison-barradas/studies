import { Cart } from "@mypharma/api-core"

export function getCartUniqueStoreIds(cart: Cart[]) {
  const data = cart.map(_cart => _cart.storeId)

  const storeIds = new Set(data)

  return storeIds
}