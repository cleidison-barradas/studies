export interface ShippingProduct {
  id: string
  slug: string
  name: string
  price: number
  quantity: number
  maxQuantity: number
}

export interface ShippingService {
  getShippingOptions: (postcode: string, products: ShippingProduct[], sender: 'courier' | 'bestshipping', authToken: string) => Promise<IShipping[]>
}

type IAdditionalServices = {
  receipt: boolean
  own_hand: boolean
  collect: boolean
}
type IDimensions = {
  height: number
  width: number
  length: number
}

type IProducts = {
  id: string
  quantity: number
}

type IPackage = {
  price: number
  discount: number
  format: string
  dimensions: IDimensions
  weight: string
  insurance_value: number
  products: IProducts[]
}

export interface IShipping {
  id: string
  name: string
  price: number
  custom_price: number
  discount: number
  currency: string
  delivery_time: number
  delivery_range: {
    min: number
    max: number
  }
  custom_delivery_time: number
  custom_delivery_range: {
    min: number
    max: number
  }
  packages: IPackage[]
  company: {
    id?: string
    name: string
    picture: string | null
  }
  additional_services?: IAdditionalServices
  error: string | null
  msg_error: string | null
}
