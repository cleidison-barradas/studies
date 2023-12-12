import { Store } from '@mypharma/api-core'

export interface IPutMainStoreRequest {
  store: Store
}

export interface IGetStoresRequest {
  name?: string
  startDate?: Date
  endDate?: Date
  updatedAt?: string
  limit?: number
  mainStore?: boolean
  page?: number
}

export interface IPutStoreRequest {
  store: Store
  users?: string[]
}

export interface IPostStoreRequest {
  store: Store
  users?: string[]
}

export interface IGetStoreReportRequest {
  startDate?: Date
  endDate?: Date
  orderLimit?: number
}

export interface IGetGMVReportRequest {
  origin: string
  startDate: Date
  endDate: Date
}

