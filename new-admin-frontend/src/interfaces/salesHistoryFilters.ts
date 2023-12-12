import { IOrderOrigin } from '../services/api/interfaces/ApiRequest'

export interface ISalesHistoryFilter {
  search: string
  page?: number
  limit?: number
  statusOrder: string
  prefix: IOrderOrigin
  orderMethod: string
  [key: string]: any
}
