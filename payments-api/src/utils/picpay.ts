import { Customer } from '@mypharma/api-core'
const { PICPAY_URL_BASE, PICPAY_NOTIFICATION_API } = process.env

import rp = require('request-promise')

const status_code = {
  created: 1,
  paid: 3,
  refunded: 18,
  expired: 7
}

interface IResponseStatusPayment {
  referenceId: String,
  status: string,
  createdAt: Date,
  updatedAt: Date,
  value: Number
}

const makeOrderForm = (referenceId: string, value: number, buyer: Customer, returnUrl: string, tenant: string, paymentId: string) => {

  const form = {
    referenceId,
    callbackUrl: `${PICPAY_NOTIFICATION_API}/${tenant}/${paymentId}`,
    returnUrl: `${returnUrl}pedido/${referenceId}`,
    value,
    buyer: {
      firstName: buyer.firstname,
      lastName: buyer.lastname,
      document: buyer.cpf || "123.456.789-10",
      email: buyer.email,
      phone: buyer.phone
    }
  }
  return form
}

const paymentRequest = async (referenceId: string, paymentId: string, value: number, buyer: Customer, returnUrl: string, picpay_token: string, tenant: string) => {

  const uri = PICPAY_URL_BASE

  const response = await rp({
    uri,
    body: makeOrderForm(referenceId, value, buyer, returnUrl, tenant, paymentId),
    json: true,
    method: 'POST',
    headers: {
      'x-picpay-token': picpay_token
    }
  })

  return response
}

const cancelRequest = async (referenceId: string, authorizationId: string, picpay_token: string) => {
  const uri = `${PICPAY_URL_BASE}/${referenceId}/cancellations`

  const response = await rp({
    uri,
    method: 'POST',
    json: true,
    body: { authorizationId },
    headers: {
      'x-picpay-token': picpay_token
    }
  })
  return response
}

const getStatus = async (referenceId: string, picpay_token: string) => {
  const uri = `${PICPAY_URL_BASE}/${referenceId}/status`

  const response: IResponseStatusPayment = await rp({
    uri,
    method: 'GET',
    json: true,
    headers: {
      'x-picpay-token': picpay_token
    }
  })
  return response
}

export { paymentRequest, cancelRequest, getStatus }
