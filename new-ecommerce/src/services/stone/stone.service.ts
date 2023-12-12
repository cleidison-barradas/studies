import apisauce from 'apisauce'
import { paymentApi } from '../../config/api'
import { CreateBoletoOrderRequest, GetStoneTokenRequest } from './stone.request'
import { ResponseStoneCreateOrder } from './stone.response'

interface GetStoneTokenResponse {
  card: {
    brand: string
    exp_month: number
    exp_year: number
    first_six_digits: string
    holder_name: string
    label: string
    last_four_digits: string
  }
  created_at: string
  expires_at: string
  id: string
  type: 'card' | string
  errors: any
}

export async function getStoneToken(data: GetStoneTokenRequest) {
  try {
    const { expireDate, number, name, cvv } = data

    const key = 'pk_test_Lw7B2OxuzVIxQK09'
    const date = expireDate.split('/')

    const body = {
      type: 'card',
      card: {
        number: number.replace(/[^0-9]/g, ''),
        holder_name: name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9 ]/g, ' '),
        exp_month: Number(date[0]),
        exp_year: Number(date[1]),
        cvv,
        label: 'Sua bandeira',
      },
    }

    const res = await apisauce
      .create({ baseURL: 'https://api.pagar.me' })
      .post<GetStoneTokenResponse>(`/core/v5/tokens?appId=${key}`, body)

    if (res.ok && res.data) {
      return res.data.id
    } else if (res.data) {
      if (res.data.errors['request.card.exp_month']) throw new Error('Data de expiração inválida')
      if (res.data.errors['request.card.brand'] || res.data.errors['request.card.number']) throw new Error('Numero de cartão inválido')
      if (res.data.errors['request.card.cvv']) throw new Error('Número de CVV inválido.')
      if (res.data.errors['request.card'] === "Card expired") throw new Error('Seu cartão está vencido. Reveja seus dados e tente novamente.')
      if (res.data.errors['request.card']) throw new Error('Dados inválidos do cartão')
    } else {
      throw new Error('Algum erro ocorreu. Por favor, tente novamente.')
    }
  } catch (err: any) {
    throw new Error(err)
  }
}

export async function createBoletoOrder(data: CreateBoletoOrderRequest) {
  return paymentApi.post<ResponseStoneCreateOrder>('/v2/order/boleto', data)
}
