import Store from "./store"

export interface IStorageAuth {
  accessToken: string
  refreshToken: string
  store: Store
}