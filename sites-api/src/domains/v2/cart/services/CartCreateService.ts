import { Cart, CartRepository } from '@mypharma/api-core'
import { v4 } from 'uuid'

interface RequestCartCreateServiceDTO {
  storeId: string
  cart: Partial<Cart>
}

class CartCreateService {

  public async execute({ cart, storeId }: RequestCartCreateServiceDTO) {

    cart.purchased = 'NO'
    cart.storeId = storeId
    cart.fingerprint = v4()
    cart.createdAt = new Date()

    return CartRepository.repo().createDoc(cart)
  }
}

export default CartCreateService
