import { ApiRequest, Get, Req, UseBefore, JsonController, AuthHandlerMiddleware, Res, CustomerTenancyMiddleware } from '@mypharma/api-core'
import { GetPaymentMethods } from './paymentMethod.service'
import { Response } from 'express'

@JsonController('/v2/payment/methods')
@UseBefore(AuthHandlerMiddleware)
export class PaymentController {
  @Get('/')
  public async index(@Req() request: ApiRequest, @Res() response: Response) {
    try {

      let paymentMethods = await GetPaymentMethods(request.tenant)

      // Filtra se for active, mas só é válido para Stone ou Pagseguro, ou seja
      // outros gateways, tais como Pix ou PicPay continuam sendo retornados ;)
      paymentMethods = paymentMethods.filter(payment => {
        const { paymentOption, active } = payment
        if (paymentOption.type === 'gateway' && (paymentOption.name.toLowerCase().includes('stone') || paymentOption.name.toLowerCase().includes('pagseguro'))) {
          return active
        }
        return true
      })

      return response.json({
        paymentMethods
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        paymentMethods: []
      })
    }
  }
}
