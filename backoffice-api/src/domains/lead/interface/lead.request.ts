import { ILeadStatus, ObjectID } from '@mypharma/api-core'

export interface IGetLeadRequest {
  search?: string
  limit?: number
  page?: number
  startDate?: Date
  endDate?: Date
  colaborator?: string
  colaboratorCpf?: string
  colaboratorCnpj?: string
  colaboratorEmail?: string
  colaboratorPhone?: string
  status?: ILeadStatus
}

export interface IPostLeadRequest {
  _id: ObjectID
  status: ILeadStatus,
}

export interface LeadsReportRequest {
  sdrInfo?: boolean
  colaborator?: string
  colaboratorCpf?: string
  colaboratorCnpj?: string
  colaboratorEmail?: string
  status?: ILeadStatus
  startDate?: Date
  endDate?: Date
}
