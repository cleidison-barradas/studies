import Address from '../../interfaces/address'
import { DeliveryMode } from '../../interfaces/deliveryMode'
import PagseguroInstallment from '../../interfaces/pagseguroInstallment'
import { IPaymentCode } from '../../interfaces/paymentCode'
import { ISender } from '../../interfaces/sender'
import { IShipping } from '../../interfaces/shipping'
import { StoreBranchPickup } from '../../interfaces/storeBranchPickup'

export interface BasicOrderProps {
  cartId: string
  comment: string
  sender: ISender
  paymentId: string
  installedApp?: boolean
  storeBranchPickup?: StoreBranchPickup | null
  authorizationId?: string
  addressId?: string | null
  paymentCode: IPaymentCode
  deliveryMode: DeliveryMode
  shipping?: IShipping | null
}

export interface CreateMoneyOrderRequest extends BasicOrderProps {
  moneyChange?: number
}

export interface CreateOnDeliveryOrderRequest extends BasicOrderProps {
  healthInsurance?: string
  payment_installments?: number
}

export interface CreatePixOrderRequest extends BasicOrderProps {
  cpf: string
}

export interface CreatePagseguroOrderRequest extends BasicOrderProps {
  cpf: string
  card_name: string
  card_token: string
  sender_hash: string
  installment: PagseguroInstallment
}

export interface CreateStoneOrderRequest extends BasicOrderProps {
  cpf: string
  card_token: string
  address?: Address
  installments: {
    quantity: number
  }
}
