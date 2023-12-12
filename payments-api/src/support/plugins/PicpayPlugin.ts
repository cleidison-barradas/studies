import Client, { AxiosInstance } from 'axios'
import { Order } from '@mypharma/api-core'

import {
  IPicpayRequestForm,
  RequestPicpayPaymentDTO,
  ResponsePicpayPaymentDTO,
  RequestPicpayCancelPaymentDTO,
  RequestPicpayStatusPaymentDTO,
  ResponsePicpayCancelPaymentDTO,
  ResponsePicpayStatusPaymentDTO
} from '../interfaces/picpay.plugin'
import picpayConfig from '../../config/picpay'

class PicpayPlugin {
  private client: AxiosInstance
  private callbackUrl: string

  private init() {
    this.client = Client.create({
      baseURL: picpayConfig.baseUrl
    })
  }

  constructor() {
    this.init()
    this.callbackUrl = picpayConfig.notificationBaseUrl
  }

  public async paymentRequest({ order, tenant, picpay_token, referenceId, document }: RequestPicpayPaymentDTO) {
    this.client.defaults.headers.common['x-picpay-token'] = picpay_token
    const body = this.buildPicpayForm(order, tenant, '', referenceId, document)

    return this.client.post<ResponsePicpayPaymentDTO>('/', body)
  }

  public async paymentCancel({ referenceId, authorizationId, picpay_token }: RequestPicpayCancelPaymentDTO) {
    this.client.defaults.headers.common['x-picpay-token'] = picpay_token

    return this.client.post<ResponsePicpayCancelPaymentDTO>(`/${referenceId}/cancellations`, { authorizationId })
  }

  public async getPaymentStatus({ referenceId, picpay_token }: RequestPicpayStatusPaymentDTO) {
    this.client.defaults.headers.common['x-picpay-token'] = picpay_token

    return this.client.get<ResponsePicpayStatusPaymentDTO>(`/${referenceId}/status`)
  }

  private buildPicpayForm(order: Order, tenant: string, storeUrl: string, referenceId: string, document: string): IPicpayRequestForm {
    const { customer: { firstname, lastname, phone, email }, totalOrder, paymentMethod } = order

    const callbackUrl = new URL(`/V2/notifications/picpay/${tenant}/${paymentMethod._id}`, this.callbackUrl).href

    const form: IPicpayRequestForm = {
      buyer: {
        email,
        phone: phone.replace(/\D/g, ''),
        document,
        lastName: lastname,
        firstName: firstname,
      },
      callbackUrl,
      referenceId,
      value: totalOrder,
      returnUrl: `${storeUrl}/pedido/${order._id}`
    }

    return form
  }

}

export default PicpayPlugin
