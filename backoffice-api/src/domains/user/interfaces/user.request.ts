import { Store, ObjectID } from '@mypharma/api-core'

export interface IGetUserRequest {
  query?: string
  limit?: number
  page?: number
  startDate?: Date
  endDate?: Date
}

export interface IPostUserRequest {
  _id?: ObjectID
  role: string
  salt: string
  email: string
  status: boolean
  avatar?: string
  userName: string
  password: string
  refreshToken: string
  plan?: string
  store: Store[]
  createdAt?: Date
  updatedAt?: Date
}
