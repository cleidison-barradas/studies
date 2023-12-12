
interface ITags {
  tag: string
  url: string
}

interface ISendFrom {
  name: string
  phone: string
  email: string
  document?: string
  company_document: string
  state_register?: string
  address: string
  complement?: string
  number: number
  district: string
  city: string
  country_id: string
  postal_code: string
  note: string
}

interface ISendTo {
  name: string
  phone: string
  email: string
  document: string
  company_document?: string
  state_register?: string
  address: string
  complement: string
  number: number
  district: string
  city: string
  state_abbr: string
  country_id: string
  postal_code: string
  note: string
}

interface ISendProducts {
  name: string
  quantity: number
  unitary_value: number
}

interface ISendVolumes {
  height: number
  width: number
  length: number
  weight: string
}

interface ISendOptions {
  insurance_value: number
  receipt: boolean
  own_hand: boolean
  reverse: boolean
  non_commercial: boolean
  invoice?: {
    key: string
  }
  platform: string
  tags: ITags[]
}

interface IAppSettings {
  weight: string
  collect: boolean
  receipt: boolean
  own_hand: boolean
  services: string[]
  addresses: []
  dimensions: []
  insurance_value: string
  jadlog_agency: number
  jadlog_agencies: string
  delivery_time_extra: number
  shipment_modify_type: string
  shipment_modify_value: number
  state_register_default: string
  insurance_value_default: number
  company_document_default: string
}

interface IProducts {
  id: string
  quantity: number
}

interface IDimensions {
  height: number
  width: number
  length: number
}

export interface IPackage {
  price: number
  discount: number
  format: string
  dimensions: IDimensions
  weight: string
  insurance_value: number
  products: IProducts[]
}

export interface IRequestCreateCart {
  service: string
  from: ISendFrom
  to: ISendTo
  products: ISendProducts[]
  volumes: ISendVolumes[]
  options: ISendOptions
  accessToken: string
  agency?: string
}

export interface IResponseAppSettings {
  settings: IAppSettings
}

export interface IResponseCreateCart {
  id: string
  protocol: string
  service_id: number
  agency_id?: number
  contract: string
  service_code?: number
  quote: number
  price: number
  coupon: any
  discount: number
  delivery_min: number
  delivery_max: number
  status: string
  reminder: any
  insurance_value: number
  weight: string
  width: number
  height: number
  length: number
  diameter: string
  format: string
  billed_weight: number
  receipt: boolean
  own_hand: boolean
  collect: boolean
  collect_scheduled_at: Date | null
  reverse: boolean
  non_commercial: boolean
  authorization_code: string | null
  tracking: string
  self_tracking: string
  delivery_receipt: boolean | null
  additional_info: any
  cte_key: any
  paid_at: any
  generated_at: any
  posted_at: any
  delivered_at: Date | null
  canceled_at: Date | null
  suspended_at: Date | null
  expired_at: Date | null
  created_at: Date
  updated_at: Date
  parse_pi_at: Date | null
  products: [
    {
      name: string
      quantity: number
      unitary_value: number
      weight: any
    }
  ]
  volumes: [
    {
      id: number
      height: string
      width: string
      length: string
      diameter: string
      weight: string
      format: string
      created_at: Date
      updated_at: Date
    }
  ]
  tags: [
    {
      tag: string
      url: string
    }
  ]
}
