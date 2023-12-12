import { ObjectID } from '@mypharma/api-core'

export interface IGetSdrRequest {
  search?: string
  status?: string
  limit?: number
  page?: number
}


export interface IPostSdrRequest {
  _id?: ObjectID
  name: string,
  email: string,
  willReceveLeadsEmail: boolean
  createdAt?: Date
  updatedAt?: Date
}
