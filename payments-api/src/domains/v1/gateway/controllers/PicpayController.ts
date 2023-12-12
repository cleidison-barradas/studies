import {
  Res,
  Post,
  Param,
  UseBefore,
  JsonController,
  NotificationHandlerMiddleware,
} from '@mypharma/api-core'
import { Response } from 'express'

import PicpayPlugin from '../../../../support/plugins/PicpayPlugin'
import PaymentGetByIdService from '../../../v2/methods/services/PaymentGetByIdService'
import HistoryOrderCreateService from '../../../v2/historyorder/services/HistoryOrderCreateService'
import PicpayOrderUpdateService from '../../../v2/picpayorder/services/PicpayOrderUpdateService'
import PicpayOrderGetByStoreOrderIdService from '../../../v2/picpayorder/services/PicpayOrderGetByStoreOrderIdService'

const picpayPlugin = new PicpayPlugin()
const paymentGetByIdService = new PaymentGetByIdService()
const historyOrderCreateService = new HistoryOrderCreateService()
const picpayOrderUpdateService = new PicpayOrderUpdateService()
const picpayOrderGetByStoreOrderIdService = new PicpayOrderGetByStoreOrderIdService()

@JsonController('/v1/gateway/picpay')
@UseBefore(NotificationHandlerMiddleware)
export class PicpayContoller {

  @Post('/:tenant/:orderId')
  public async post(@Res() response: Response, @Param('tenant') tenant: string, @Param('orderId') orderId: string) {
    try {

      let picpayOrder = await picpayOrderGetByStoreOrderIdService.getPicpayOrderByStoreOrderId({ tenant, orderId })
      const { authorizationId = undefined, order, status } = picpayOrder

      if (status !== 'refunded') {
        const statusOrder = order.statusOrder
        const referenceId = picpayOrder._id.toString()
        const paymentId = order.paymentMethod._id.toString()

        const paymentMethod = await paymentGetByIdService.findPaymentMethodById({ tenant, paymentId })

        const [picpayToken, picpaySellerToken] = paymentMethod.extras

        if (!picpayToken || !picpaySellerToken) {

          throw new Error('payment_method_not_elegible')
        }

        try {
          const picpay_token = String(picpayToken)

          const { data: transaction } = await picpayPlugin.paymentCancel({ referenceId, picpay_token, authorizationId })

          picpayOrder.authorizationId = transaction.cancellationId
          picpayOrder.updatedAt = new Date()

          await picpayOrderUpdateService.execute({ tenant, orderId: picpayOrder._id.toString(), picpayOrder })

          await historyOrderCreateService.execute({ tenant, order, statusOrder, comments: 'Solicitado Estorno para o cliente' })

        } catch (error) {
          console.log(error)
          return response.status(500).json({
            error: 'internal_server_error'
          })
        }
      }

      return response.json({
        ok: true
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }
}
