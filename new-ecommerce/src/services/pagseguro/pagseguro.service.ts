import { paymentApi } from '../../config/api'
import { GetInstallmentsRequest } from './pagseguro.request'
import { PagseguroSessionResponse } from './pagseguro.response'

export async function PagseguroSession(payment_option_id: string) {
  return paymentApi.post<PagseguroSessionResponse>('/v1/gateway/session', { payment_option_id })
}

export const GetPagseguroHash = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    (window as any)._PagSeguroDirectPayment.onSenderHashReady((response: any) => {
      if (response && response.status !== 'error') resolve(response.senderHash)
      else reject(response.status)
    })
  })
}

export const GetInstallments = ({ amount, brand = '' }: GetInstallmentsRequest): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (brand.length === 0) reject('Invalid card brand')
    else {
      (window as any)._PagSeguroDirectPayment.getInstallments({
        amount,
        brand,
        success({ installments }: any) {
          resolve(installments[brand])
        },
        error(response: any) {
          reject(response)
        },
      })
    }
  })
}

export const GetCardBrand = (cardNumber: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (cardNumber.length < 6) {
      resolve('')
    }

    if ((window as any)._PagSeguroDirectPayment) {
      (window as any)._PagSeguroDirectPayment.getBrand({
        cardBin: Number(cardNumber.replace(/\D/g, '')),
        success(value: string) {
          resolve(value)
        },
        error(response: any) {
          reject(response)
        },
      })
    }
  })
}

interface CardBrand {
  bin: number
  name: string
  cvvSize: number
  expirable: boolean
  international: boolean
  validationAlgorithm: string
  config: Record<string, any>
}

interface CreateCardTokenProps {
  cardNumber: string
  cardBrand: CardBrand
  cardCVC: string
  cardExpire: string
}

export const CreateCardToken = (options: CreateCardTokenProps): Promise<any> => {
  return new Promise((resolve, reject) => {
    const { cardNumber, cardBrand, cardCVC, cardExpire } = options

    const [expireMonth, expireYear] = cardExpire.split('/')
      ; (window as any)._PagSeguroDirectPayment.createCardToken({
        cardNumber: cardNumber.replace(/\D/g, ''), // Número do cartão de crédito
        brand: cardBrand.name, // Bandeira do cartão, existe um método helper na SDK do pagseguro pra obter essa informação a partir dos 6 primeiros dígitos do cartão
        cvv: cardCVC, // CVV do cartão
        expirationMonth: expireMonth, // Mês da expiração do cartão
        expirationYear: expireYear, // Ano da expiração do cartão, é necessário os 4 dígitos.
        success({ card: { token } }: any) {
          resolve(token)
        },
        error({ errors }: any) {
          const _errors: any = []
          Object.keys(errors).forEach((k) => {
            _errors.push({
              code: Number(k) || k,
              error: errors[k],
            })
          })
          reject(new CreateCardTokenException(_errors, 'CREATE_CARD_TOKEN_ERROR'))
        },
      })
  })
}

export class CreateCardTokenException extends Error {
  errors: {}
  constructor(errors = {}, ...params: any) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CreateCardTokenException)
    }

    this.name = 'CreateCardTokenException'
    this.errors = errors
  }
}
