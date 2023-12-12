import { Cupom } from '@mypharma/api-core'
import CartGetService from '../../cart/services/CartGetService'
import CartUpdateService from '../../cart/services/CartUpdateService'

interface RequestCupomCartAddServiceDTO {
  cupom?: Cupom
  storeId: string
  fingerprint: string
}

class CupomCartAddService {

  public async execute({ storeId, fingerprint, cupom }: RequestCupomCartAddServiceDTO) {
    const cartGetService = new CartGetService()
    const cartUpdateService = new CartUpdateService()

    const cart = await cartGetService.execute({ storeId, fingerprint })

    if (!cart) {
      throw new Error('cart_not_found')
    }

    cart.updatedAt = new Date()
    cart.cupom = cupom ? cupom : null

    await cartUpdateService.execute({ storeId, cart })
  }
}

export default CupomCartAddService
