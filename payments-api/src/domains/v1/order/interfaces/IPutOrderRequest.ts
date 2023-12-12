import IProductRequest from './IProductRequest'
import Iinstallments from './IInstallments'
import IShippingAddress from './IShippingAddress'
import IShippingData from './IShippingData'

export default interface IPutOrderRequest {
  address_id: string
  card_holder: string
  card_token: string
  stone_card: string
  city_id: string
  cpf?: string
  payment_code: string,
  payment_money_change: number
  payment_option_id: string,
  payment_custom_field: any,
  products: IProductRequest[]
  installments: Iinstallments
  sender_hash: string
  sub_method: string,
  health_insurance?: string
  code?: string
  shipping_order?: IShippingData,
  delivery_mode?: 'store_pickup' | 'own_delivery' | 'delivery_company'
}
