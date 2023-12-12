import { Body, JsonController, ORM, Param, Post, Req, Res, UseBefore } from "@mypharma/api-core"
import { Request, Response, urlencoded } from 'express'
import { RequestBodyNotificationDTO, RequestPagseguroNotificationDTO } from './interfaces/picpay'

import OrderGetService from "../order/services/OrderGetService"
import OrderUpdateService from "../order/services/OrderUpdateService"

import PaymentGetByIdService from "../methods/services/PaymentGetByIdService"

import PicpayOrderGetService from "../picpayorder/services/PicpayOrderGetService"
import PicpayOrderUpdateService from "../picpayorder/services/PicpayOrderUpdateService"

import PagseguroGetOrderService from '../pagseguroorder/services/PagseguroGetOrderService'
import PagseguroUpdateOrderService from '../pagseguroorder/services/PagseguroUpdateOrderService'

import GetStatusOrderService from "../statusOrder/services/GetStatusOrderServices"

import HistoryOrderCreateService from "../historyorder/services/HistoryOrderCreateService"

import ParsePicpayStatusOrderService from '../picpayorder/services/ParsePicpayStatusOrderService'
import CommentGenerateService from "./services/CommentService"
import ParsePagseguroStatusOrderService from '../pagseguroorder/services/ParsePagseguroStatusOrderService'

import PicpayPlugin from "../../../support/plugins/PicpayPlugin"
import PagseguroPlugin from "../../../support/plugins/PagseguroPlugin"

const picpayPlugin = new PicpayPlugin()

const orderGetService = new OrderGetService()
const orderUpdateService = new OrderUpdateService()
const statusOrderGetService = new GetStatusOrderService()
const historyOrderCreateService = new HistoryOrderCreateService()

const commentGenerateService = new CommentGenerateService()
const paymentGetService = new PaymentGetByIdService()

const pagseguroGetOrderService = new PagseguroGetOrderService()
const pagseguroUpdateOrderService = new PagseguroUpdateOrderService()
const parsePagseguroStatusOrderService = new ParsePagseguroStatusOrderService()

const picPayOrderGetService = new PicpayOrderGetService()
const picPayOrderUpdateService = new PicpayOrderUpdateService()
const parsePicpayStatusOrderService = new ParsePicpayStatusOrderService()

const urlencodedParser = urlencoded({ extended: true })

@JsonController('/v2/notifications')
export class NotificationsController {

  @Post('/picpay/:tenant/:paymentId')
  public async picpayNotification(@Req() request: Request, @Res() response: Response, @Param('tenant') tenant: string, @Param('paymentId') paymentId: string, @Body() body: RequestBodyNotificationDTO) {
    try {
      const { referenceId = '' } = body

      if (!tenant || !paymentId) {

        return response.status(403).json({
          error: 'missing_fields'
        })
      }

      await ORM.setup(null, tenant)

      let picpayOrder = await picPayOrderGetService.execute({ tenant, orderId: referenceId })

      const paymentMethod = await paymentGetService.findPaymentMethodById({ tenant, paymentId })

      const [token, seller_token] = paymentMethod.extras

      if (!token || !seller_token) {

        return response.status(404).json({
          error: 'method_not_elegible'
        })
      }

      const picpay_token = String(token).trim()

      const { data: picPayTransactionStatus } = await picpayPlugin.getPaymentStatus({ referenceId, picpay_token })

      const status = parsePicpayStatusOrderService.parseStatusOrder({ status: picPayTransactionStatus.status })

      const statusOrder = await statusOrderGetService.execute({ type: [status] })

      const comments = commentGenerateService.generateComments({ status: statusOrder[0].type })

      const orderId = picpayOrder.order._id.toString()

      let order = await orderGetService.execute({ tenant, orderId })

      order.statusOrder = statusOrder[0]
      order.updatedAt = new Date()

      order = await orderUpdateService.execute({ tenant, order, orderId })

      picpayOrder.order = order
      picpayOrder.status = picPayTransactionStatus.status
      picpayOrder.authorizationId = picPayTransactionStatus.authorizationId
      picpayOrder.updatedAt = new Date()

      picpayOrder = await picPayOrderUpdateService.execute({ tenant, orderId: referenceId, picpayOrder })

      await historyOrderCreateService.execute({ tenant, order, comments, statusOrder: statusOrder[0] })

      return response.status(200).send()

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_errro'
      })

    }
  }

  @Post('/pagseguro/:tenant/:paymentId')
  @UseBefore(urlencodedParser)
  public async pagseguroNotification(@Req() request: Request, @Res() response: Response, @Param('tenant') tenant: string, @Param('paymentId') paymentId: string, @Body() body: RequestPagseguroNotificationDTO) {
    try {
      const { notificationCode } = body

      if (!tenant || !paymentId) {

        return response.status(403).json({
          error: 'missing_fields'
        })
      }
      await ORM.setup(null, tenant)

      const paymentMethod = await paymentGetService.findPaymentMethodById({ tenant, paymentId })

      const [pagseguro_email, pagseguro_token] = paymentMethod.extras

      if (!pagseguro_token || !pagseguro_email) {

        return response.status(404).json({
          error: 'method_not_elegible'
        })
      }

      const pagseguroEmail = String(pagseguro_email)
      const pagseguroToken = String(pagseguro_token)

      const pagSeguroPlugin = new PagseguroPlugin({ pagseguroEmail, pagseguroToken })

      const { transaction } = await pagSeguroPlugin.getStatusPayment({ notificationCode })

      const pagseguroId = transaction.code[0]

      let pagseguroOrder = await pagseguroGetOrderService.execute({ tenant, pagseguroId })

      const status = parsePagseguroStatusOrderService.parseStatusOrder({ status: transaction.status[0] })

      const statusOrder = await statusOrderGetService.execute({ type: [status] })

      const comments = commentGenerateService.generateComments({ status: statusOrder[0].type })

      const orderId = pagseguroOrder.order._id.toString()

      let order = await orderGetService.execute({ tenant, orderId })

      order.statusOrder = statusOrder[0]
      order.updatedAt = new Date()

      order = await orderUpdateService.execute({ tenant, order, orderId })

      pagseguroOrder.order = order
      pagseguroOrder.status = Number(transaction.status[0])
      pagseguroOrder.updatedAt = new Date()

      await pagseguroUpdateOrderService.execute({ tenant, order: pagseguroOrder })

      await historyOrderCreateService.execute({ tenant, order, comments, statusOrder: statusOrder[0] })

      return response.status(200).send()

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_errro'
      })
    }
  }
}