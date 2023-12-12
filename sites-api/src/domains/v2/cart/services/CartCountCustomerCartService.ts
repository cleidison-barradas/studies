import { CartRepository } from '@mypharma/api-core'

interface CartCountCustomerCartServiceDTO {
  storeId: string
  customerId: string
}

class CartCountCustomerCartService {
  constructor(private repository?: any) { }

  public async countCustomerCarts({ storeId, customerId }: CartCountCustomerCartServiceDTO) {

    return CartRepository.repo().count({ customerId, storeId })
  }
}


export default CartCountCustomerCartService
