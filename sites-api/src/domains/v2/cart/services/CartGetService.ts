import { CartRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

interface RequestCartGetServiceDTO {
  storeId: string
  cartId?: string
  fingerprint?: string
}

class CartGetService {
  public async execute({ storeId, cartId, fingerprint }: RequestCartGetServiceDTO) {
    const where: Record<string, any> = {
      storeId
    }

    if (cartId) {

      where['_id'] = new ObjectId(cartId)
    }

    if (fingerprint) {

      where['fingerprint'] = fingerprint
    }

    if (Object.keys(where).length <= 0) {
      throw Error('find_criteria_not_provided')
    }

    const cart = await CartRepository.repo().findOne({
      where
    })

    if (!cart) {
      throw Error('cart_not_found')
    }

    return cart
  }
}

export default CartGetService
