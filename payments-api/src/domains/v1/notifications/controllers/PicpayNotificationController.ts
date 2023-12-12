import {
  Req,
  Res,
  Body,
  Post,
  Param,
  UseBefore,
  JsonController,
  NotificationHandlerMiddleware,
} from '@mypharma/api-core'
import { Request, Response } from 'express'

import NotificationRequest from '../interfaces/IPostPicpayNotification'

import { GetPicpayOrder, GetPaymentOption, GetOrderStatus, UpdateOrderPicpay, UpdateOrder, AddOrderLog } from '../services/NotificationService'

import { getStatus } from '../../../../utils/picpay'

@JsonController('/v1/notifications-picpay')
@UseBefore(NotificationHandlerMiddleware)
export class PicpayNotificationController {

  @Post('/:tenant/:paymentId')
  public async post(
    @Req() request: Request,
    @Res() response: Response,
    @Body() body: NotificationRequest,
    @Param('tenant') tenant: string,
    @Param('paymentId') paymentId: string) {

    const { authorizationId, referenceId } = body
    let error = null

    try {
      const payment = await GetPaymentOption(tenant, paymentId)

      if (!payment) {
        error = 'payment_not_found'
        console.log(error)
        return response.status(404).json({
          error
        })
      }

      if (payment.extras.length === 0) {
        error = 'payment_not_elegible'
        console.log(error)
        return response.status(400).json({
          error
        })
      }
      const [picpaytoken, picpaySellertoken] = payment.extras

      response.header({
        'x-seller-token': picpaySellertoken.toString()
      })

      let picpayOrder = await GetPicpayOrder(tenant, referenceId)

      if (!picpayOrder) {
        error = 'picpay_order_not_found'
        console.log(error)
        return response.status(404).json({
          error
        })
      }

      const picPayStatus = await getStatus(referenceId, picpaytoken.toString())
      const orderStatus = await GetOrderStatus()
      const { status } = picPayStatus

      const orderId = picpayOrder.order._id.toString()
      delete picpayOrder._id

      if (authorizationId) {
        if (status === 'paid') {
          const statusOrder = orderStatus.find(x => x.type.toString() === 'payment_made')

          const { value } = await UpdateOrder(tenant, orderId, { statusOrder, updatedAt: new Date() })
          picpayOrder.status = status
          picpayOrder.order = value
          picpayOrder.updatedAt = new Date()
          picpayOrder.authorizationId = authorizationId

          await AddOrderLog(tenant, { order: value, status: statusOrder, comments: 'pagamento realizado!' })
        }

        if (status === 'refunded') {
          const statusOrder = orderStatus.find(x => x.type.toString() === 'rejected')

          const { value } = await UpdateOrder(tenant, orderId, { statusOrder, updatedAt: new Date() })
          picpayOrder.status = status
          picpayOrder.order = value
          picpayOrder.updatedAt = new Date()
          picpayOrder.authorizationId = authorizationId

          await AddOrderLog(tenant, { order: value, status: statusOrder, comments: 'pagamento estornado' })
        }
        await UpdateOrderPicpay(tenant, orderId, picpayOrder)
      } else {

        if (status === 'expired') {
          const statusOrder = orderStatus.find(x => x.type.toString() === 'rejected')

          const { value } = await UpdateOrder(tenant, orderId, { statusOrder, updatedAt: new Date() })
          picpayOrder.status = status
          picpayOrder.order = value
          picpayOrder.updatedAt = new Date()

          await AddOrderLog(tenant, { order: value, status: statusOrder, comments: 'prazo de pagamento exiprado' })
          await UpdateOrderPicpay(tenant, orderId, picpayOrder)
        }
      }

      await UpdateOrderPicpay(tenant, orderId, { status, updatedAt: new Date() })

      return response.status(200).json({})

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }
}
