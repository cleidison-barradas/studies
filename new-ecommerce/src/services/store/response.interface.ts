import Store from '../../interfaces/store'

export interface StartupResponse {
  accessToken: string
  store: Store
}

export interface IstoreGroupResponse {
  name: string
  url: string
  address: string
  storeGroup: any
}

export interface IstoreGroupArray {
  storeGroup: IstoreGroupResponse[]
}