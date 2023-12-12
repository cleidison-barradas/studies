import { StoreData } from './StoreData'
import { UserData } from './UserData'
import { ProductData } from './ProductData'

interface BaseCaptureData {
  fingerprint: string,
  store: StoreData,
  user: UserData | null,
  userAgent: string,
  origin: string
}

export interface SearchCaptureData extends BaseCaptureData {
  term: string,
  products: ProductData[]
}

export interface AttractionCaptureData extends BaseCaptureData {
  product: ProductData
}

export interface StarCaptureData extends BaseCaptureData {
  product: ProductData
}