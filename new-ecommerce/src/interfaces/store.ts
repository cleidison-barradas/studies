import Plan from './plan'
import StoreGroups from './storeGroups'
import StoreSettings from './storeSettings'
import StoreUrls from './storeUrls'

export default interface Store {
  _id?: string
  external_id?: number
  name: string
  url: string
  tenant: string
  PMC_id?: number
  settings: StoreSettings
  updatedAt?: Date
  createdAt?: Date
  storeUrls?: StoreUrls[]
  mainStore?: boolean
  plan: Plan
  urls?: StoreUrls[]
  groups?: StoreGroups
  facebookUrl: string
  googleUrl: string
  storeGroup?: []
}

export interface StoreArray {
  stores: Store[]
}