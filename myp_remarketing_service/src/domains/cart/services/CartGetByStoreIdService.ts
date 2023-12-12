import { Cart } from "@mypharma/api-core"

interface CartGetByStoreIdServiceDTO {
  storeId: string
  carts: Cart[]
}

class CartGetByStoreIdService {
  constructor(private respository?: any) { }

  public getCartsByStoreId({ storeId, carts = [] }: CartGetByStoreIdServiceDTO) {

    return carts.filter(_cart => _cart.storeId === storeId)
  }
}

export default CartGetByStoreIdService