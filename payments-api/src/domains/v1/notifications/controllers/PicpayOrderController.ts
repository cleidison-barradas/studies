import { ApiRequest, AuthHandlerMiddleware, Get, JsonController, Param, Req, Res, UseBefore } from '@mypharma/api-core'
import { Response } from 'express'
import { GetPicpayOrder } from '../services/NotificationService'

@JsonController('/v1/order-picpay')
@UseBefore(AuthHandlerMiddleware)
export class PicpayOrderController {

  @Get('/detail/:orderId')
  public async index(@Req() request: ApiRequest, @Res() response: Response, @Param('orderId') orderId: string) {
    const { tenant } = request
  
    try {
      const result = await GetPicpayOrder(tenant, orderId)

      if (!result) {
        return response.status(404).json({
          error: 'picpay_order_not_found'
        })
      }

      return {
        order: {
          order_id: result.order._id,
          status: result.status
        }
      }

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }
}