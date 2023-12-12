import { Cart, Cupom } from '@mypharma/api-core'
import getLowerProductPrice from '../../../../helpers/getLowerProductPrice'
import OrderCountService from '../../cart/services/OrderCountService'

interface RequestCupomElegibleServiceDTO {
  cart: Cart
  cupom: Cupom
  tenant: string
  customerId?: string
}

class CupomElegibleService {

  public async execute({ cart, cupom, tenant, customerId = null }: RequestCupomElegibleServiceDTO) {
    let subTotal = 0
    const orderCountService = new OrderCountService()
    const { code, minimumPrice = 0, amount = 0 } = cupom

    if (minimumPrice > 0) {

      cart.products.forEach(_product => {
        subTotal += getLowerProductPrice(_product.product) * Number(_product.quantity)
      })
    }

    if (subTotal < minimumPrice) {

      throw Error('minimum_price_not_reached')
    }

    if (customerId) {
      const count = await orderCountService.execute({ tenant, customerId, code })

      if (amount > 0 && count >= amount) {

        throw Error('cupom_usage_limit_reached')
      }
    }

    return true
  }
}

export default CupomElegibleService
