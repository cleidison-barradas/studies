import { Order } from "@mypharma/api-core"

export type ITransactionCountry = 'BRA'
export type ITransactionCurrency = 'BRL'
export type ITransactionMode = 'default'
export type ITransactionMethod = 'creditCard' | 'boleto'
export type ITransactionShippingType = 1 | 2 | 3

export interface IInstallments {
  amount: number
  quantity: number
  noInterestInstallmentQuantity?: boolean
}


export interface IPagseguroTransaction {
  paymentMode: ITransactionMode
  paymentMethod: ITransactionMethod
  receiverEmail: string
  currency: ITransactionCurrency
  extraAmount?: number
  notificationURL: string
  reference: string
  senderName: string
  senderCPF: string
  senderAreaCode: string
  senderPhone: string
  senderEmail: string
  senderHash: string
  shippingAddressStreet: string
  shippingAddressNumber: string
  shippingAddressComplement: string
  shippingAddressDistrict: string
  shippingAddressPostalCode: string
  shippingAddressCity: string
  shippingAddressState: string
  shippingAddressCountry: ITransactionCountry
  shippingType?: ITransactionShippingType
  shippingCost?: string
  creditCardToken: string
  installmentQuantity: number
  installmentValue: string
  noInterestInstallmentQuantity?: number
  creditCardHolderName: string
  creditCardHolderCPF: string
  creditCardHolderBirthDate: string
  creditCardHolderAreaCode: string
  creditCardHolderPhone: string
  billingAddressStreet: string
  billingAddressNumber: string
  billingAddressComplement: string
  billingAddressDistrict: string
  billingAddressPostalCode: string
  billingAddressCity: string
  billingAddressState: string
  billingAddressCountry: ITransactionCountry
  [key: string]: string | number
}

export interface RequestPagseguroTransactionDTO {
  order: Order
  tenant: string
  paymentId: string
  card_cpf: string
  card_name: string
  card_token: string
  referenceId: string
  sender_hash: string
  installment: IInstallments
}

interface IPagseguroTransactionDTO {
  date: string[]
  code: string[]
  reference: string[]
  type: number[]
  status: number[]
  lastEventDate: string
  [key: string]: any
}

export interface ResponsePagseguroTransaction {
  transaction: IPagseguroTransactionDTO
}

export interface RequestCancelPagseguroTransaction {
  transactionCode: string
}

export interface RequestStatusPagseguroTransaction {
  notificationCode: string
}