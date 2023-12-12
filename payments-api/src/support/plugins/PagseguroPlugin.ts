import * as RequestPromise from 'request-promise'
import { parseString } from 'xml2js'

import pagseguroConfig from '../../config/pagseguro'
import { RequestPagseguroTransactionDTO, ResponsePagseguroTransaction, RequestCancelPagseguroTransaction, RequestStatusPagseguroTransaction } from '../interfaces/pagseguro.plugin'
import { PagseguroBuildForm } from '../helpers/PagseguroBuildForm'

interface PagseguroOptionsDTO {
  pagseguroEmail: string
  pagseguroToken: string
}

class PagseguroPlugin {
  private client: RequestPromise.RequestPromiseOptions
  private email: string
  private token: string

  constructor({ pagseguroEmail, pagseguroToken }: PagseguroOptionsDTO) {
    this.email = pagseguroEmail
    this.token = pagseguroToken
    this.client = {}
    this.client.json = false
    this.client.baseUrl = pagseguroConfig.baseUrl
    this.client.qs = { email: this.email, token: this.token }

  }

  public async startSession() {
    let response: any = null

    const pagseguroResponse = await RequestPromise({
      ...this.client,
      uri: '/v2/sessions',
      method: 'POST'
    })

    parseString(pagseguroResponse, (err, result) => {

      if (err) response = err
      response = result
    })

    return response
  }

  public async requestPayment({ order, card_name, card_token, card_cpf, sender_hash, installment, tenant, paymentId, referenceId }: RequestPagseguroTransactionDTO): Promise<ResponsePagseguroTransaction> {
    let response: ResponsePagseguroTransaction = null
    const data = PagseguroBuildForm(order, referenceId, card_name, card_token, card_cpf, sender_hash, installment, this.email, tenant, paymentId)

    const pagseguroResponse = await RequestPromise({
      ...this.client,
      form: data,
      method: 'POST',
      uri: '/v2/transactions'
    })

    parseString(pagseguroResponse, (err, result) => {
      if (err) return err
      response = result
    })

    return response
  }

  public async cancelPayment({ transactionCode }: RequestCancelPagseguroTransaction) {
    let response: any = null

    const pagseguroResponse = await RequestPromise({
      ...this.client,
      method: 'POST',
      form: { transactionCode },
      uri: '/v2/transactions/refunds'
    })

    parseString(pagseguroResponse, (err, result) => {
      if (err) response = err
      response = result
    })

    return response

  }

  public async getStatusPayment({ notificationCode }: RequestStatusPagseguroTransaction): Promise<ResponsePagseguroTransaction> {
    let response: any = null

    const pagseguroResponse = await RequestPromise({
      ...this.client,
      method: 'GET',
      uri: `/v3/transactions/notifications/${notificationCode}`
    })

    parseString(pagseguroResponse, (err, result) => {
      if (err) response = err
      response = result
    })

    return response

  }

}

export default PagseguroPlugin
