import Order from '../../interfaces/order'

interface PicPayQRCode {
  base64: string
  content: string
}

interface PicpayTransactionResponse {
  expiresAt: string
  paymentUrl: string
  referenceId: string
  qrcode: PicPayQRCode
}

interface PixTransactionResponse {
  qrcode: string
  imagemQrcode: string
}

export interface CreatePixOrderResponse {
  order: Order
  pixTransaction: PixTransactionResponse
}

export interface CreateStoneOrderResponse {
  order: Order
  error?: string
}

export interface GetOrderResponse {
  orders: Order[]
  order?: Order
}

export interface CreatePagseguroOrderResponse {
  order: Order
  error?: string
}

export interface CreatePicpayOrderResponse {
  order: Order
  error?: string
  picPayTransaction: PicpayTransactionResponse
}

export interface CreateMoneyOrderResponse {
  order: Order
  error?: string
}

export interface CreateOnDeliveryOrderResponse {
  order: Order
  error?: string
}
