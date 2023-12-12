import Store from '../../interfaces/store'

export interface PostSearchRequest {
  fingerprint: string | null
  query: string
  store: Store | null
  tenant: string
  size?: number
}
