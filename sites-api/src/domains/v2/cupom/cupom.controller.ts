import { ApiRequest, CustomerTenancyMiddleware, Get, JsonController, QueryParam, Req, Res, UseBefore } from '@mypharma/api-core'
import { Response } from 'express'

import CartGetService from '../cart/services/CartGetService'
import CartUpdateService from '../cart/services/CartUpdateService'

import CupomFindService from './services/CupomFindService'
import CupomElegibleService from './services/CupomElegibleService'

// Cart Services
const cartGetService = new CartGetService()
const cartUpdateService = new CartUpdateService()
// Cupom Services
const cupomfindService = new CupomFindService()
const cupomElegibleService = new CupomElegibleService()

@JsonController('/cupom')
@UseBefore(CustomerTenancyMiddleware)
export class CupomController {
  @Get('/')
  async getCupom(@Req() request: ApiRequest, @QueryParam('cart') fingerprint: string, @QueryParam('code') code: string, @Res() response: Response) {
    const { tenant, session: { store: storeId } } = request

    let cart = await cartGetService.execute({ storeId, fingerprint })

    try {

      const cupom = await cupomfindService.execute({ code, tenant })

      const cartProducts = cart.products
      const customerId = cart.customerId || undefined

      try {
        cart.cupom = null

        cart.products = cartProducts

        const isElegibleCupom = await cupomElegibleService.execute({ cart, cupom, tenant, customerId })

        cart = await cartUpdateService.execute({ cart, cupom, storeId, isElegibleCupom })

        return response.json({
          cupom,
        })
      } catch (error) {
        console.log(error)
        return response.status(500).json({
          cupom,
          error: error.message,
        })
      }
    } catch (error) {
      console.log(error)

      if (error.message.includes('cupom_not_found') || error.message.includes('cupom_expired')) {
        cart.cupom = null
        cart = await cartUpdateService.execute({ storeId, cart })
      }

      return response.status(500).json({
        cupom: null,
        error: error.message
      })
    }
  }
}
