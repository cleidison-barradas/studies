import Cupom from '../../../interfaces/cupom'
import ImageFile from '../../../interfaces/file'
import { IFiscalDocument, IOrderDispatch } from '../../../interfaces/fiscalDocument'
import MarketingAutomations from '../../../interfaces/marketingAutomations'
import PaymentMethods from '../../../interfaces/paymentMethods'
import PaymentOption from '../../../interfaces/paymentOption'
import Product from '../../../interfaces/product'

export type IOrderOrigin = 'ecommerce' | 'iFood' | ''

export interface UserSessionRequest {
  username: string
  password: string
}

export interface UpdatedProductStatusRequest {
  status: boolean
  product: string[] | string
}

export interface RequestGetPayments {
  id?: string
  page?: number
  limit?: number
}

export interface RequestPutPayment {
  paymentMethod: Partial<PaymentMethods>
  covenant?: boolean
}

export interface RequestPutPaymentOption {
  paymentOption: Omit<PaymentOption, '_id'>
}

export interface RequestPutPix {
  paymentMethod: Partial<PaymentMethods>
  certificate?: File
}

export interface RequestPutStone {
  paymentMethod: Partial<PaymentMethods>
  certificate?: File
}

export interface RequestGetManufacturer {
  name?: string
  limit?: number
  page?: number
  id?: string
}

export interface RequestUpdateProduct {
  products: Product[] | Product
}

export interface RequestReport {
  type: 'customer' | 'order'
  prefix: IOrderOrigin
  startAt: Date | null
  endAt: Date | null
  orderStatus?: string | StatusFilter[]
}

export interface UpdateProductCategory {
  category: string[]
  product: Product[] | Product
}
export interface RequestPutCupom {
  cupom: Cupom
  notify?: boolean
}

export interface PutImportPromotion {
  date_start: Date
  date_end: Date
  file: File
}

export interface PutImportProduct {
  file: File
  updateProduct: boolean
}

export interface RequestGetProducts {
  page?: number
  limit?: number
  query: string | null
  status: any | null
  category: string[]
  manufacturer: string[]
  miscellaneousFilters: string[]
  [key: string]: any
}

export interface RequestGetAdminNotification {
  page?: number
  limit?: number
  type: string | null
  [key: string]: any
}

export interface RequestIFoodOrders {
  search?: string
  status?: string
  start?: Date
  end?: Date
  page?: number
  limit?: number
}

export interface IMarketingAutomationRequest {
  automations: MarketingAutomations
}

export interface RequestSalesHistory {
  page?: number
  limit?: number
  search?: string
  prefix: IOrderOrigin
  statusOrder?: string
  orderMethod?: string
}

export interface RequestImportCustomer {
  file: File
  license: string
}

export interface RequestAddImage {
  folder: string,
  file: ImageFile
}

export interface RequestClassifications {
  page?: number
  limit?: number
  name?: string
  id?: string

}

export interface RequestGetPaymentLinks {
  page?: number
  limit?: number
  createdAt?: Date
  query: string | null
  [key: string]: any
}

export interface StatusFilter {
  label: string
  value: string
  tooltipText?: string
}

export interface EpharmaRequest {
  config_epharma_clientId: string,
  config_epharma_username: string,
  config_epharma_password: string
}

export interface RequestRecurringCard {
  cardNumber: string
  cardCvv: string
  printedNameCard: string
  cpfCardHolder: string
  cardExpiration: {
    month: string
    year: string
  }
}

export interface RequestPutOrderFiscalDocument {
  orderId: string
  fiscalDocument: IFiscalDocument
}

export interface RequestPutOrderDispatch {
  orderId: string
  orderDispatch: IOrderDispatch
}

// PaymentMethods - Covenant
export interface PutCovenantMethodRequest {
  paymentMethod: Partial<PaymentMethods>
}

// PaymentMethods - Gateways
export interface PutGatewayMethodRequest {
  paymentMethod: Partial<PaymentMethods>
}
