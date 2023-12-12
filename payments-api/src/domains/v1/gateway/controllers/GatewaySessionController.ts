import { ApiRequest, Req, UseBefore, JsonController, AuthHandlerMiddleware, Body, Post, Res, Param } from '@mypharma/api-core'
import PaymentGetService from '../../../v2/methods/services/PaymentGetByIdService'
import PagseguroPlugin from '../../../../support/plugins/PagseguroPlugin'
import PostGateway from '../interfaces/IPostGatewayRequest'
import { Response } from 'express'

const paymentGetService = new PaymentGetService()

@JsonController('/v1/gateway/session')
@UseBefore(AuthHandlerMiddleware)
export class GatewayController {
  @Post('/')
  public async post(@Req() request: ApiRequest, @Body() body: PostGateway, @Res() response: Response) {
    try {
      const { tenant } = request
      const { payment_option_id: paymentId } = body

      const paymentMethod = await paymentGetService.findPaymentMethodById({ tenant, paymentId })

      const [pagseguro_email, pagseguro_token] = paymentMethod.extras

      if (!pagseguro_email || !pagseguro_token) {
        throw new Error('payment_method_not_elegible')
      }

      const pagseguroEmail = String(pagseguro_email)
      const pagseguroToken = String(pagseguro_token)

      const pagSeguroPlugin = new PagseguroPlugin({ pagseguroEmail, pagseguroToken })

      const pagseguroSessionResponse = await pagSeguroPlugin.startSession()

      const session = pagseguroSessionResponse.session.id[0]

      return response.json({
        session
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error
      })
    }
  }
}
