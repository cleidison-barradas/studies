import { Address, Product, StoreBranchPickup } from '@mypharma/api-core'
import { IDeliveryMode } from '../../../interfaces/deliveryMode'
import { IPaymentCode } from '../../../interfaces/paymentCode'
import { IShipping } from '../../../interfaces/shipping'
import { IInstallments } from '../../../support/interfaces/pagseguro.plugin'
import { ISender } from '../../../interfaces/sender'

export interface OrderProductField {
  product: Product
  unitaryValue: number
  promotionalPrice: number
  amount: number
}

export interface AuthorizedTransactionItems {
  ean: string
  salePrice: number
  categoryId: number
  productName: string
  factoryPrice: number
  approvedQuantity: number
  storeMaximumPrice: number
  retailTransferValue: number
  unitAcquisitionPrice: number
  rejectionReason: string
}

export interface BasicOrderDTO {
  cartId: string
  comment: string
  sender?: ISender
  paymentId: string
  addressId?: string
  shipping?: IShipping
  installedApp?: boolean
  authorizationId?: string
  paymentCode: IPaymentCode
  deliveryMode: IDeliveryMode
  storeBranchPickup: StoreBranchPickup
}

export interface RequestBodyMoneyOrderDTO extends BasicOrderDTO {
  moneyChange: number
}

export interface RequestBodyOnDeliveryOrderDTO extends BasicOrderDTO {
  healthInsurance?: string
  payment_installments?: number
}

export interface RequestBodyPixOrderDTO extends BasicOrderDTO {
  cpf: string
}

export interface RequestBodyPicpayOrderDTO extends BasicOrderDTO {
  cpf: string
}

export interface RequestBodyPagseguroOrderDTO extends BasicOrderDTO {
  cpf: string
  card_name: string
  card_token: string
  sender_hash: string
  installment: IInstallments
}

export interface StoneOrderDTO extends BasicOrderDTO {
  installments: {
    total: number
    quantity: number
    hasFee: boolean
    feeValue?: number
  }
  card_token: string
  cpf: string
  address?: Address
}

export interface BoletoOrderDTO extends BasicOrderDTO {
  cpf: string
}
