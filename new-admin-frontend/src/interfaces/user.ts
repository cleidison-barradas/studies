import Store from "./store"

export interface IUser {
  _id?: string
  role: string
  email: string
  store: Store[]
  status: string
  userName: string
  password: string
  refreshToken: string
}