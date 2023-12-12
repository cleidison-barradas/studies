import { Cart, CartRepository } from '@mypharma/api-core'
import RemarketingDeleteService from '../../remarketing/services/RemarketingDeleteService'

const remarketingDeleteService = new RemarketingDeleteService()

interface CartGetCartByCustomerIdServiceDTO {
  cart: Cart
  storeId: string
  customerId: string
}

class CartGetCartByCustomerIdService {
  constructor(private repository?: any) { }

  public async getCartByCustomerId({ storeId, cart, customerId }: CartGetCartByCustomerIdServiceDTO) {

    const customerCart = await CartRepository.repo().findOne({
      where: { customerId, storeId }
    })

    if (customerCart && customerCart._id !== cart._id) {
      customerCart.products.push(...cart.products)

      cart = customerCart
    }

    await remarketingDeleteService.remarketingDeleteTaskService({ storeId, customerId })

    return cart
  }
}

export default CartGetCartByCustomerIdService
