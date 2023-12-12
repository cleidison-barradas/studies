import { Put, Body, Res, Req, UseBefore, ApiRequest, JsonController, AuthHandlerMiddleware, Post, InternalServerError, ObjectID } from '@mypharma/api-core'
import { Response } from 'express'
import { GetCart, PutCart, UpdateCart, GetCupomActive, GetCupom, GetProductByEAN, LoadStoreByID } from '../services/CartService'
import { ParseProductCoupom } from '../../../../utils/product-check-coupon'
import { v4 } from 'uuid'

@JsonController('/v1/cart/unknow')
@UseBefore(AuthHandlerMiddleware)
export class CartUnknownController {
  @Put('/')
  public async put(@Req() request: ApiRequest, @Body() body: any, @Res() response: Response) {
    const { products, code, fingerprint, user, origin } = body
    const { tenant } = request
    let cart = null
    let cupom = null
    let deliveryFree = false

    if (user) {
      cupom = await GetCupomActive(tenant, code, user.customer_id)
    } else {
      cupom = await GetCupom(tenant, code)
    }

    const parsedProducts = await ParseProductCoupom(tenant, cupom, products)
    deliveryFree = cupom && cupom.type === 'delivery' ? true : false

    if (fingerprint) {
      cart = await GetCart(tenant, fingerprint)
    }

    if (!cart) {
      cart = {
        fingerprint: v4(),
        products: products,
        productsCupom: parsedProducts,
        cupom: [],
      }
      cart = await PutCart(tenant, cart)

      return response.json({
        cart: {
          ...cart,
          products: products,
          productsCupom: parsedProducts,
        },
      })
    }

    cart = {
      ...cart,
      products: products,
      productsCupom: parsedProducts,
    }

    const cartId = cart._id
    delete cart._id

    // const { value } = await UpdateCart(tenant, cartId, cart)

    return response.json({
      cart: {
        products: products,
        productsCupom: parsedProducts,
        code: cupom ? cupom.code : null,
      },
    })
  }
}
