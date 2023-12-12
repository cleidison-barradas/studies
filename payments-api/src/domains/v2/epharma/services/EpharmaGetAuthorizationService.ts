import { CartProductRequest, ObjectID, PbmAuthorization, PbmAuthorizationRepository } from '@mypharma/api-core'
import * as moment from 'moment'

interface EpharmaGetAuthorizationServiceDTO {
  storeId: string
  authorizationId?: string
  cartProducts: CartProductRequest[]
}

class EpharmaGetAuthorizationService {

  public async getAuthorization({ authorizationId, storeId, cartProducts = [] }: EpharmaGetAuthorizationServiceDTO) {
    try {

      if (!authorizationId) throw new Error('authorization_id_not_provided')
      let authorization = new PbmAuthorization()

      const _id = new ObjectID(authorizationId)

      authorization = await PbmAuthorizationRepository.repo().findOne({
        where: {
          _id,
          storeId
        }
      })

      if (!authorization) throw new Error('authorization_not_found')

      const { tokenExpirationDate } = authorization

      if (tokenExpirationDate && !moment().isSameOrBefore(tokenExpirationDate)) {
        await PbmAuthorizationRepository.repo().deleteOne({ _id: new ObjectID(authorizationId) })

        throw new Error('token_expired')
      }

      const cartEans = cartProducts.map(cartProduct => cartProduct.product.EAN)

      const productAuthorized = authorization.productAuthorized.filter(productAuthorized => cartEans.indexOf(productAuthorized.ean) !== -1)

      authorization.productAuthorized = productAuthorized

      if (productAuthorized.length <= 0) {

        throw new Error('missing_product_on_cart_authorized')
      }

      return {
        authorization
      }

    } catch (error) {
      console.log(error)

      return {
        authorization: null
      }
    }
  }
}

export default EpharmaGetAuthorizationService
