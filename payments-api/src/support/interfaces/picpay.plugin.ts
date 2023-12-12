import { Order } from "@mypharma/api-core"

export type IPicpayStatus = 'created' | 'expired' | 'analysis' | 'paid' | 'completed' | 'refunded' | 'chargeback'

interface IPicpayBuyer {
  email: string
  phone: string
  document: string
  lastName: string
  firstName: string
}

interface IPicpayQRCode {
  base64: string
  content: string
}

export interface IPicpayRequestForm {
  value: number
  returnUrl: string
  referenceId: string
  callbackUrl: string
  buyer: IPicpayBuyer
}

export interface RequestPicpayPaymentDTO {
  order: Order
  tenant: string
  document: string
  referenceId: string
  picpay_token: string
}

export interface RequestPicpayCancelPaymentDTO {
  referenceId: string
  picpay_token: string
  authorizationId?: string
}

export interface RequestPicpayStatusPaymentDTO {
  referenceId: string
  picpay_token: string
}

export interface ResponsePicpayPaymentDTO {
  expiresAt: string
  paymentUrl: string
  referenceId: string
  qrcode: IPicpayQRCode
}

export interface ResponsePicpayCancelPaymentDTO {
  referenceId: string
  cancellationId: string
}

export interface ResponsePicpayStatusPaymentDTO {
  status: IPicpayStatus
  referenceId: string
  authorizationId: string
}