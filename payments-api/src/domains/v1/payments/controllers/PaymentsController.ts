import {
  ApiRequest,
  Get,
  Req,
  UseBefore,
  JsonController,
  AuthHandlerMiddleware,
  Res,
} from '@mypharma/api-core'
import { GetPayments } from '../services/PaymentService'
import { Response } from 'express'

@JsonController('/v1/payment/methods')
@UseBefore(AuthHandlerMiddleware)
export class PaymentController {
  @Get('/')
  public async index(@Req() request: ApiRequest, @Res() response: Response) {
    try {
      let payments = []
      payments = await GetPayments(request.tenant)

      payments = payments.map(payment => {
        const { _id, active, paymentOption: { name, type } } = payment

        return {
          option_id: _id.toString(),
          name,
          type,
          active
        }
      })

      // Filtra se for active, mas só é válido para Stone ou Pagseguro, ou seja
      // outros gateways, tais como Pix ou PicPay continuam sendo retornados ;)
      payments = payments.filter(payment => {
        if(payment.type === 'gateway' && (payment.name === "Stone" || payment.name === "Pagseguro")) 
          return payment.active === true
        else
          return payment
      })

      return response.json({
          paymentMethods: payments
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: "Error"
      })
    }
  }
}
