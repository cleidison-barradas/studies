import {
  Res,
  Req,
  Post,
  Body,
  Param,
  UseBefore,
  JsonController,
  NotificationHandlerMiddleware,
} from '@mypharma/api-core'
import NotificationRequest from '../interfaces/IPostRequestNotification'
import { Request, Response } from 'express'
import { GetPaymentOption, GetPagseguroOrder, UpdateOrderPagseguro, GetOrderStatus, UpdateOrder, AddOrderLog } from '../services/NotificationService'
import { getNotification } from '../../../../utils/pagseguro'
import { urlencoded } from 'express'

const urlencodedParser = urlencoded({ extended: true })

@UseBefore(NotificationHandlerMiddleware)
@JsonController('/v1/notifications')
export class PagSeguroNotificationController {

  @Post('/:tenant/:paymentId')
  @UseBefore(urlencodedParser)
  public async post(
    @Req() request: Request,
    @Res() response: Response,
    @Body() body: NotificationRequest,
    @Param('tenant') tenant: string,
    @Param('paymentId') paymentId: string) {

    const { notificationCode } = body

    let error = null

    if (!tenant || !paymentId) {
      error = 'params_not_provided'
      console.log(error)
      return response.status(400).json({
        error
      })
    }

    const OrderStatus = await GetOrderStatus()
    const paymentMethod = await GetPaymentOption(tenant, paymentId)

    if (!paymentMethod) {
      error = 'payment_method_not_found'
      console.log(error)
      return response.status(404).json({
        error
      })
    }

    if (paymentMethod.extras.length === 0) {
      error = 'payment_method_not_elegible'
      console.log(error)
      return response.status(400).json({
        error
      })
    }

    const [pagseguroEmail, pagseguroToken] = paymentMethod.extras

    const data = await getNotification(notificationCode, pagseguroEmail.toString(), pagseguroToken.toString())

    let pagseguroOrder = await GetPagseguroOrder(tenant, data.transaction.code[0])

    if (!pagseguroOrder) {
      error = 'pagseguro_order_not_found'
      console.log(error)
      return response.status(404).json({
        error
      })
    }

    const orderId = pagseguroOrder.order._id.toString()
    delete pagseguroOrder._id

    if (Number(data.transaction.status[0]) === 7 || Number(data.transaction.status[0]) === 6) {
      const type = Number(data.transaction.status[0]) === 7 ? 'rejected' : 'reversed'
      const comments = Number(data.transaction.status[0]) === 7 ? 'Pagamento cancelado pelo gateway' : 'Pagamento estornado'
      const status = OrderStatus.find(x => x.type.toString() === type)

      const { value } = await UpdateOrder(tenant, orderId, { statusOrder: status, updatedAt: new Date() })
      pagseguroOrder.order = value

      await AddOrderLog(tenant, { order: value, status, comments })
      await UpdateOrderPagseguro(tenant, orderId, pagseguroOrder)
    }

    await UpdateOrderPagseguro(tenant, orderId, { status: Number(data.transaction.status[0]) })

    return response.status(200).json({})
  }
}
