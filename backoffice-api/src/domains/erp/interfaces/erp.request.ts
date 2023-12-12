import { IntegrationErp } from '@mypharma/api-core'

export interface IGetErpRequest {
  name?: string
  limit?: number
  page?: number
}

export interface ICreateErp {
  erp: IntegrationErp
}

export interface IUpdateErp {
  erp: IntegrationErp
}
