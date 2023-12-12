
export type StoneTiketType = 'DM' | 'none'
export type StoneCustomerType = 'individual'
export type StoneDocumentType = 'CPF' | 'CNPJ'
export type StonePaymentType = 'credit_card' | 'boleto'
export type StonePaymentOperationType = 'auth_and_capture' | 'none'

interface StoneDevice {
  platform: string
}

interface CardData {
  token: string
  billing_address?: StoneCustomerAddressData
}

interface StoneOrderItemData {
  amount: number
  quantity: number
  description: string
}

export interface StoneCreditCardData {
  card: CardData
  recurrence: boolean
  installments: number
  statement_descriptor: string
  operation_type: StonePaymentOperationType
}

export interface StoneTiketData {
  bank: string
  due_at: Date
  instructions: string
  type: StoneTiketType
}

interface StoneCustomerPaymentData {
  payment_method: StonePaymentType
  boleto?: StoneTiketData
  credit_card?: StoneCreditCardData
}

interface StoneCustomerShippingData {
  amount: number
  description: string
  recipient_name: string
  recipient_phone: string
  address: StoneCustomerAddressData
}

interface StoneCustomerAddressData {
  country: string
  state: string
  city: string
  zip_code: string
  line_1: string
}

interface StoneCustomerPhonesData {
  [key: string]: {
    number: string
    area_code: string
    country_code: string
  }
}

interface StoneCustomerData {
  name: string
  email: string
  document: string
  type: StoneCustomerType
  document_type: StoneDocumentType
  phones: StoneCustomerPhonesData
  address: StoneCustomerAddressData
}

interface StoneTransaction {
  id: string,
  transaction_type: string,
  gateway_id: string,
  amount: number,
  status: string,
  success: boolean,
  url: string,
  pdf: string,
  line: string,
  barcode: string,
  qr_code: string,
  nosso_numero: string,
  type: string,
  bank: string,
  instructions: string,
  due_at: string,
  created_at: string,
  updated_at: string,
  gateway_response: Array<any>,
  antifraud_response: {}
}

interface StoneOrderCharges {
  id: string,
  code: string,
  amount: number,
  status: string,
  currency: string,
  payment_method: string,
  created_at: Date,
  updated_at: Date,
  customer: any,
  last_transaction: StoneTransaction
}

export interface StoneCustomerOrderData {
  device: StoneDevice
  antifraud_enabled: boolean
  items: StoneOrderItemData[]
  customer: StoneCustomerData
  shipping: StoneCustomerShippingData
  payments: StoneCustomerPaymentData[]
}

export interface RequestCreateStoneOrder {
  order: StoneCustomerOrderData
}

export interface ResponseCreateStoneOrder {
  id: string,
  code: string,
  amount: number,
  currency: string,
  closed: boolean,
  items: Array<any>,
  customer: any,
  shipping: any,
  status: string,
  created_at: Date,
  updated_at: Date,
  closed_at: Date,
  device: any,
  checkouts: Array<any>
  charges: StoneOrderCharges[],
}