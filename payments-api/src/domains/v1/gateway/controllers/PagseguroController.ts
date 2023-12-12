import {
  Res,
  Post,
  Param,
  UseBefore,
  JsonController,
  NotificationHandlerMiddleware,
} from '@mypharma/api-core'
import { Response } from 'express'

import PagseguroPlugin from '../../../../support/plugins/PagseguroPlugin'
import PaymentGetByIdService from '../../../v2/methods/services/PaymentGetByIdService'
import HistoryOrderCreateService from '../../../v2/historyorder/services/HistoryOrderCreateService'
import PagseguroGetPagseguroOrderByOrderIdService from '../../../v2/pagseguroorder/services/PagseguroGetPagseguroOrderByOrderIdService'

const paymentGetByIdService = new PaymentGetByIdService()
const historyOrderCreateService = new HistoryOrderCreateService()
const pagseguroGetPagseguroOrderByOrderIdService = new PagseguroGetPagseguroOrderByOrderIdService()

@JsonController('/v1/gateway/pagseguro')
@UseBefore(NotificationHandlerMiddleware)
export class PagseguroContoller {

  @Post('/:tenant/:orderId')
  public async post(@Res() response: Response, @Param('tenant') tenant: string, @Param('orderId') orderId: string) {

    try {

      let pagseguroOrder = await pagseguroGetPagseguroOrderByOrderIdService.getPagseguroOrderByStoreOrderId({ tenant, orderId })

      const { order, pagseguroId, status } = pagseguroOrder

      if (!pagseguroId) {

        throw new Error('waiting_payment')
      }
      const statusOrder = order.statusOrder
      const paymentId = order.paymentMethod._id.toString()

      const paymentMethod = await paymentGetByIdService.findPaymentMethodById({ tenant, paymentId })

      const [pagseguro_email, pagseguro_token] = paymentMethod.extras

      if (!pagseguro_email || !pagseguro_token) {

        throw new Error('payment_method_not_elegible')
      }

      if (status !== 7 && status !== 6) {

        try {

          const pagseguroEmail = String(pagseguro_email)
          const pagseguroToken = String(pagseguro_token)

          const pagseguroPlugin = new PagseguroPlugin({ pagseguroEmail, pagseguroToken })

          await pagseguroPlugin.cancelPayment({ transactionCode: pagseguroId })

          await historyOrderCreateService.execute({ tenant, order, statusOrder, comments: 'Solicitado Estorno para o cliente' })

        } catch (error) {
          console.log(error)
          return response.status(500).json({
            error: 'internal_server_error'
          })
        }
      }

      return response.send({ ok: true })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }
}
