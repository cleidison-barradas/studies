import { getGMVReport } from '..'
import { Billboard } from '../../../interfaces/billboard'
import Category from '../../../interfaces/category'
import Classification from '../../../interfaces/classification'
import Control from '../../../interfaces/control'
import Erp from '../../../interfaces/erp'
import File from '../../../interfaces/file'
import { IntegrationData } from '../../../interfaces/integrationApi'
import IntegrationLog from '../../../interfaces/integrationLog'
import Manufacturer from '../../../interfaces/manufacturer'
import Plan from '../../../interfaces/plan'
import Pmc from '../../../interfaces/pmc'
import Product from '../../../interfaces/product'
import Store from '../../../interfaces/store'
import StoreGroup from '../../../interfaces/storeGroup'
import Tenant from '../../../interfaces/tenant'
import User from '../../../interfaces/user'
import SDR from '../../../interfaces/SDR'
import Lead from '../../../interfaces/Lead'

export interface ApiResponse<T> {
  ok: boolean
  problem: string
  data: T | any | null
}

export interface Pagination {
  total: number
  limit: number
  pages: number
  currentPage: number
  prevPage: any
  nextPage: any
}

export interface BasicDeleteResponse {
  deletedId: string
}

export interface UserSessionResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface UserTenantResponse {
  tenants: Tenant[]
}

export interface UserSetTenantResponse {
  accessToken: string
  refreshToken: string
}

export interface GetStoresResponse {
  stores: Store[]
}

export interface GetStoreResponse {
  store: Store
}

export interface GetApiIntegrationResponse {
  api_data: IntegrationData
}

export interface GetUsersResponse {
  users: User[]
}

export interface GetErpsResponse {
  erps: Erp[]
}

export interface GetErpResponse {
  erps: Erp
}

export interface GetPlansResponse {
  plans: Plan[]
}

export interface GetPlanResponse {
  plan: Plan
}

export interface GetStoreGroupsResponse {
  storeGroups: StoreGroup[]
}

export interface GetCategoryResponse {
  categories: Category[]
}

export interface GetProductsResponse {
  products: Product[]
  limit: number
  currentPage: number
  total: number
}

export interface PostUserResponse {
  user: User
}

export interface PmcResponse {
  pmcs: Pmc[]
}

export interface GenericDeleteResponse {
  deletedId: string
}

export interface UpdateErpResponse {
  erp: Erp
}

export interface GetProductResponse {
  product: Product
}

export interface GetBillboardResponse {
  billboards: Billboard[]
}

export interface PutBillboardResponse {
  billboard: Billboard
}

export interface PostPmcResponse {
  ok: boolean
}

export interface GetManufacturerResponse {
  manufacturers: Manufacturer[]
}

export interface GetIntegrationLogResponse {
  integrations: IntegrationLog[]
}


export interface GetStoresReport {
  report: string
}
export interface GetIntegrationsReportResponse {
  report: string
}
// SDRs
export interface GetSDRsResponse {
  sdrs: SDR[]
}

export interface GetSDRResponse {
  sdr: SDR
}
export interface PostSDRResponse {
  sdr: SDR
}

// Leads
export interface GetLeadsResponse {
  leads: Lead[]
}
export interface GetLeadResponse {
  lead: Lead
}

export interface PostLeadResponse {
  lead: Lead
}

export interface GetControlResponse {
  controls: Control[]
}

export interface GetClassificationResponse {
  classifications: Classification[]

}

export interface RemoveCpfIndexes {
  sucess: boolean
}

export interface ResponseUpdateStoreProductsControlRequest{
  sucess: boolean
}

export interface GetGMVReport {
  report: string
}

export interface ResponseStoresReportGmv {
  report: File
}
