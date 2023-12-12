import { Cart, CartRepository } from "@mypharma/api-core"
import { ObjectId } from "bson"
import { CartServiceRepository } from "../../../../repositories/internals"

interface RequestGetCartServiceDTO {
  cartId: string
  storeId: string
}

class CartGetService {

  constructor(private repository?: CartServiceRepository) { }

  public async findCartById({ storeId, cartId }: RequestGetCartServiceDTO) {
    let cart: Cart | null = null

    if (!this.repository) {

      cart = await CartRepository.repo().findOne({
        where: {
          _id: new ObjectId(cartId),
          storeId
        }
      })
    } else {

      cart = await this.repository.findOne(cartId)
    }

    if (!cart) {

      throw new Error('cart_not_found')
    }


    if (cart.products.length <= 0) {

      throw new Error('cart_product_invalid')
    }

    return cart
  }
}

export default CartGetService