export interface IDimensions {
  height: number
  width: number
  length: number
}

interface IShippingProduct {
  id?: string
  quantity: number
}

export interface IShippingPackage {
  price: number
  discount: number
  format: string
  weight: string
  insurance_value: number
  dimensions?: IDimensions
  products: IShippingProduct[]
}

export interface IShipping {
  id?: number
  name: string
  price: number
  custom_price: number
  discount?: number
  currency?: string
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
  packages: IShippingPackage[]
  additional_services?: {
    receipt: boolean
    own_hand: boolean
    collect: boolean
  }
  company: {
    id?: string
    name: string
    picture?: string
  }
}
