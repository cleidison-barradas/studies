import { CartProductRequest, PbmAuthorization } from '@mypharma/api-core'

interface EpharmaGetCartProductsAuthorizedServiceDTO {
  authorization?: PbmAuthorization
  cartProducts: CartProductRequest[]
}

class EpharmaGetCartProductsAuthorizedService {

  public async getCartProductsAuthorized({ cartProducts, authorization }: EpharmaGetCartProductsAuthorizedServiceDTO) {
    const cartEans = cartProducts.map(cartProduct => cartProduct.product.EAN)

    const authorized = authorization ? authorization.productAuthorized.filter(authorize => cartEans.includes(authorize.ean)) : []

    return authorized
  }
}


export default EpharmaGetCartProductsAuthorizedService
