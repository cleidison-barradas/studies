import { Cart, Cupom } from '@mypharma/api-core'
import getLowerProductPrice from '../../../../helpers/getLowerProductPrice'
import OrderCountService from '../../cart/services/OrderCountService'

interface RequestCartCupomValidateServiceDTO {
  cart: Cart
  cupom: Cupom
  tenant: string
  customerId?: string
}

class CartCupomValidateService {

  public async validateCupomIsElegible({ cart, cupom, tenant, customerId = null }: RequestCartCupomValidateServiceDTO) {
    let subTotal = 0
    const orderCountService = new OrderCountService()
    const { code, minimumPrice = 0, amount = 0 } = cupom

    if (minimumPrice > 0) {

      cart.products.forEach(_product => {
        subTotal += getLowerProductPrice(_product.product) * Number(_product.quantity)
      })
    }

    if (subTotal < minimumPrice) {

      return false
    }

    if (customerId) {
      const count = await orderCountService.execute({ tenant, customerId, code })

      if (amount > 0 && count >= amount) {

        return false
      }
    }

    return true
  }
}

export default CartCupomValidateService
