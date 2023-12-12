import { paymentApi } from '../../config/api'
import { handleErrorResponse } from '../../helpers/handleErrorResponse'

import {
  BasicOrderProps,
  CreatePixOrderRequest,
  CreateStoneOrderRequest,
  CreateMoneyOrderRequest,
  CreatePagseguroOrderRequest,
  CreateOnDeliveryOrderRequest,
} from './request.interface'

import {
  GetOrderResponse,
  CreatePixOrderResponse,
  CreateMoneyOrderResponse,
  CreatePicpayOrderResponse,
  CreatePagseguroOrderResponse,
  CreateOnDeliveryOrderResponse,
  CreateStoneOrderResponse,
} from './response.interface'

export async function CreateMoneyOrder(data: CreateMoneyOrderRequest) {
  return paymentApi.post<CreateMoneyOrderResponse>('/v2/order/money', data)
}

export async function CreateOnDeliveryOrder(data: CreateOnDeliveryOrderRequest) {
  return paymentApi.post<CreateOnDeliveryOrderResponse>('/v2/order/onDelivery', data)
}

export async function CreatePixOrder(data: CreatePixOrderRequest) {
  return paymentApi.post<CreatePixOrderResponse>('/v2/order/pix', data)
}

export async function GetOrders(orderId: string = '') {
  return paymentApi
    .get<GetOrderResponse>(`/v2/order/${orderId}`)
    .then((response) => response.data)
    .catch(handleErrorResponse)
}

export const CreatePagseguroOrder = async (data: CreatePagseguroOrderRequest) => {
  return paymentApi.post<CreatePagseguroOrderResponse>('/v2/order/pagseguro', data)
}

export const CreateStoneCardOrder = async (data: CreateStoneOrderRequest) => {
  return paymentApi.post<CreateStoneOrderResponse>('/v2/order/stone', data)
}

export const CreatePicpayOrder = async (data: BasicOrderProps) => {
  return paymentApi.post<CreatePicpayOrderResponse>(`v2/order/picpay`, data)
}
