import { Cart, CartRepository } from "@mypharma/api-core"
import { ObjectId } from 'bson'
import { CartServiceRepository } from "../../../../repositories/internals"

interface RequestCartUpdateServiceDTO {
  storeId: string
  cartId: string
  cart: Cart
}

class CartUpdateService {
  constructor(private repository?: CartServiceRepository) { }

  public async execute({ storeId, cartId, cart }: RequestCartUpdateServiceDTO) {
    cart.updatedAt = new Date()

    if (!this.repository) {
      delete cart._id

      await CartRepository.repo().updateOne(
        { _id: new ObjectId(cartId), storeId },
        { $set: { ...cart } }
      )

      return CartRepository.repo().findById(new ObjectId(cartId))
    }

    return await this.repository.updateOne(cart)

  }
}

export default CartUpdateService