import Plan from '../../../interfaces/plan'
import Store from '../../../interfaces/store'
import User from '../../../interfaces/user'
import Product from '../../../interfaces/product'
import { Billboard } from '../../../interfaces/billboard'
import SDR from '../../../interfaces/SDR'

export interface UserSessionRequest {
  userName: string
  password: string
}

export interface GetStoresRequest {
  name?: string
  page?: number
  limit?: number
  mainStore?: boolean
  endDate?: Date
  startDate?: Date
  updatedAt?: Date
}

export interface GetStoreRequest {
  filters: {
    name: string
    updatedAt: string
  }
  page: number
}

export interface PutStoreRequest {
  store: Partial<Store> | null
  users?: User['_id'][]
}

export interface PostUserRequest {
  userName: string
  store: Store[]
  email: string
  role: string
  status: string
  password: string
}

export interface GetUsersRequest {
  limit?: number
  page?: number
  query?: string
  startDate?: Date
  endDate?: Date
}

export interface GetStoreGroupsRequest {
  limit?: number
  page?: number
}

export interface GetCategoryRequest {
  limit?: number
  page?: number
  query?: Record<any, any>
}

export interface GetProductRequest {
  limit?: number
  page?: number
  name?: string
  start?: Date
  end?: Date
  updatedAt?: string
  others?: string
  category?: string
}

export interface PutUserRequest {
  userName: string
  store: Store[]
  email: string
  role: string
  status: string
  password: string
}

export interface BasicFilterRequest {
  name?: string
  limit?: number
  page?: number
}

export interface PutStorePlanRequest {
  plan: Plan
}
export interface GetStorePlanRequest {
  search: any
}

export interface PostProductRequest {
  _id?: string
  tenant?: string
  product: Partial<Product>
}

export interface GetBillboardRequest {
  limit?: number
  page?: number
  name?: string
}

export interface PutBillboardRequest {
  billboard: Billboard
}

export interface PostImportPmcRequest {
  file: Blob
  store: string
}

export interface GetIntegrationLogRequest {
  limit?: number
  page?: number
  search?: string
  status?: string
}

export interface RequestStoresReport {
  orderLimit: number | null
  startDate: Date | null
  endDate: Date | null
}

export interface PostUpdateStoreProductsControlRequest{
  tenant: string
}

export interface IntegrationStoresReport {
  status: string | null
  startDate: Date | null
  endDate: Date | null
}

// SDRs
export interface GetSDRsRequest {
  limit?: number
  page?: number
  query?: string
}

export interface PostSDRRequest {
  name: string,
  email: string,
  willReceveLeadsEmail: boolean,
}

// Leads
export interface GetLeadsRequest {
  limit?: number
  page?: number
  query?: string
}

export interface GetLeadRequest {
  sdr: SDR
}

export interface PostLeadRequest {
  status: string
}

export interface LeadsReportRequest {
  colaborator: string | undefined
  colaboratorCpf: string | undefined
  colaboratorCnpj: string | undefined
  colaboratorEmail: string | undefined
  colaboratorPhone: string | undefined
  status: string | undefined
  startDate: Date | null
  endDate: Date | null
  sdrInfo: boolean
}

export interface GetRemoveCpfIndexes {
  _id: string
}

export interface RequestGMVReport {
  origin: string
  startDate: Date | null
  endDate: Date | null
}
