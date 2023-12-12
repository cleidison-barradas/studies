import { Cart, CartRepository, Cupom } from '@mypharma/api-core'
import { ObjectId } from 'bson'
import CartCountCustomerCartService from './CartCountCustomerCartService'

interface RequestCartUpdateServiceDTO {
  cart: Cart
  cupom?: Cupom
  storeId: string
  customerId?: string
  isElegibleCupom?: boolean
}

const cartCountCustomerCartService = new CartCountCustomerCartService()

class CartUpdateService {

  public async execute({ cart, storeId, customerId, cupom = null, isElegibleCupom = false }: RequestCartUpdateServiceDTO) {
    const _id = new ObjectId(cart._id.toString())
    delete cart._id

    if (isElegibleCupom && cupom) {
      cart.cupom = cupom
    }

    if (customerId) {
      const count = await cartCountCustomerCartService.countCustomerCarts({ storeId, customerId })

      if (count > 1) {

        await CartRepository.repo().deleteMany({ customerId, storeId, _id: { $ne: _id } })
      }

      cart.customerId = customerId
    }

    await CartRepository.repo().updateOne(
      { _id },
      {
        $set: cart
      })

    return CartRepository.repo().findById(_id)
  }
}

export default CartUpdateService
