/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiRequest, Body, Cart, CustomerTenancyMiddleware, Get, JsonController, Put, QueryParam, QueryParams, Req, Res, UseBefore } from '@mypharma/api-core'
import { Response, json, urlencoded } from 'express'
import { SaveCartRequest } from './request.interface'
import CartGetService from './services/CartGetService'
import CartCreateService from './services/CartCreateService'
import CartUpdateService from './services/CartUpdateService'
import CartSyncProductService from './services/CartSyncProductService'
import CartCupomValidateService from './services/CartCupomValidateService'
import CartGetCartByCustomerIdService from './services/CartGetCartByCustomerIdService'

import CupomFindService from '../cupom/services/CupomFindService'
import GetPaymentLinkService from './services/GetPaymentLinkService'

// Cart Services
const cartGetService = new CartGetService()
const cartCreateService = new CartCreateService()
const cartUpdateService = new CartUpdateService()
const cartSyncProductService = new CartSyncProductService()
const cartCupomValidateService = new CartCupomValidateService()
const cartGetCartByCustomerIdService = new CartGetCartByCustomerIdService()
const getPaymentLinkService = new GetPaymentLinkService()

// Cupom Services
const cupomFindService = new CupomFindService()

@JsonController('/v2/cart')
@UseBefore(CustomerTenancyMiddleware)
export class CartController {
  @Get('/')
  async getByFingerprint(@Res() response: Response, @Req() request: ApiRequest, @QueryParams() query: any) {
    const { tenant, session: { store: storeId } } = request
    const { fingerprint = null, customerId = null } = query
    let cart = new Cart()

    try {
      if (!fingerprint) {
        cart.cupom = null
        cart.products = []
        cart.customerId = customerId

        cart = await cartCreateService.execute({ storeId, cart })

        return response.json({
          cart,
        })
      }

      cart = await cartGetService.execute({ storeId, fingerprint })

      if (customerId) {
        cart = await cartGetCartByCustomerIdService.getCartByCustomerId({ cart, storeId, customerId })
      }

      const cartId = cart._id.toString()
      cart.customerId = customerId
      cart.products = await cartSyncProductService.execute({ cartProducts: cart.products, tenant, cartId })

      cart = await cartUpdateService.execute({ storeId, cart })

      if (cart.cupom) {
        try {
          const code = cart.cupom.code
          cart.cupom = null

          const cupom = await cupomFindService.execute({ code, tenant })

          const isElegibleCupom = await cartCupomValidateService.validateCupomIsElegible({ cupom, tenant, cart, customerId })

          cart = await cartUpdateService.execute({ cart, cupom, storeId, isElegibleCupom })
        } catch (error) {
          console.log(error)
          return response.status(500).json({
            cart,
            error: error.message,
          })
        }
      }

      return response.json({
        cart,
      })
    } catch (error) {
      console.log(error)

      if (error.message.includes('cart_not_found')) {
        cart.cupom = null
        cart.products = []
        cart.customerId = customerId

        cart = await cartCreateService.execute({ cart, storeId })

        return response.json({
          cart,
        })
      }

      return response.status(500).json({
        error: error.message,
      })
    }
  }

  @Put('/')
  @UseBefore(urlencoded({ extended: true, limit: '150mb' }), json({ limit: '150mb' }))
  async saveCart(@Res() response: Response, @Req() request: ApiRequest, @Body() body: SaveCartRequest, @QueryParam('customerId') customerId: string) {
    try {
      const { tenant, session: { store: storeId } } = request
      let { cart } = body

      const paymentLink = await getPaymentLinkService.execute({ tenant, cartId: cart._id?.toString() })

      if (customerId && !paymentLink) {

        cart = await cartGetCartByCustomerIdService.getCartByCustomerId({ customerId, storeId, cart })
      }

      const cartId = cart._id?.toString()

      cart.products = await cartSyncProductService.execute({ cartProducts: cart.products, tenant, cartId })
      cart.purchased = 'NO'
      cart.updatedAt = new Date()

      cart = await cartUpdateService.execute({ storeId, cart })

      if (cart.cupom) {
        try {
          const code = cart.cupom.code
          cart.cupom = null

          const cupom = await cupomFindService.execute({ code, tenant })

          const isElegibleCupom = await cartCupomValidateService.validateCupomIsElegible({ tenant, cupom, cart, customerId })

          cart = await cartUpdateService.execute({ cart, cupom, storeId, isElegibleCupom })

        } catch (error) {
          console.log(error)
          return response.status(500).json({
            cart,
            error: error.message,
          })
        }
      }

      return response.json({
        cart
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        cart: {
          cupom: null,
          products: [],
          fingerprint: null,
        },
      })
    }
  }
}
