import { create, HEADERS } from 'apisauce'
import { AuthApi } from '../../config'

import {
  ApiResponse,
  BasicDeleteResponse,
  GenericDeleteResponse,
  GetCategoryResponse,
  GetErpResponse,
  GetPlanResponse,
  GetErpsResponse,
  GetPlansResponse,
  GetProductResponse,
  GetStoreGroupsResponse,
  GetStoreResponse,
  GetStoresResponse,
  GetUsersResponse,
  PmcResponse,
  PostUserResponse,
  UpdateErpResponse,
  UserSessionResponse,
  GetProductsResponse,
  GetBillboardResponse,
  PutBillboardResponse,
  PostPmcResponse,
  GetManufacturerResponse,
  GetIntegrationLogResponse,
  GetStoresReport,
  GetApiIntegrationResponse,
  GetClassificationResponse,
  GetControlResponse,
  RemoveCpfIndexes,
  GetGMVReport,
  ResponseStoresReportGmv,
  GetIntegrationsReportResponse,
  GetSDRsResponse,
  GetSDRResponse,
  PostSDRResponse,
  GetLeadsResponse,
  GetLeadResponse,
  PostLeadResponse,
  ResponseUpdateStoreProductsControlRequest

} from './interfaces/ApiResponse'

import {
  BasicFilterRequest,
  GetCategoryRequest,
  GetProductRequest,
  GetStoreGroupsRequest,
  GetStoresRequest,
  GetUsersRequest,
  PostProductRequest,
  PutStorePlanRequest,
  PutStoreRequest,
  PostUserRequest,
  UserSessionRequest,
  PutBillboardRequest,
  GetIntegrationLogRequest,
  RequestStoresReport,
  GetRemoveCpfIndexes,
  RequestGMVReport,
  IntegrationStoresReport,
  GetSDRsRequest,
  PostSDRRequest,
  GetLeadsRequest,
  PostLeadRequest,
  LeadsReportRequest,
  PostUpdateStoreProductsControlRequest,
} from './interfaces/ApiRequest'
import Store from '../../interfaces/store'
import Plan from '../../interfaces/store'
import Erp from '../../interfaces/erp'
import { Billboard } from '../../interfaces/billboard'

// Create our ApiSauce instance
const api = create({
  baseURL: AuthApi,
})

export const authApi = create({
  baseURL: AuthApi,
})

// Configuration
export const setHeaders = (opts: HEADERS) => api.setHeaders(opts)
export const setURL = (url: string) => api.setBaseURL(url)
export const setToken = (token: string) => api.setHeader('Authorization', `Bearer ${token}`)

// Auth methods
export const sessionRequest = async (data: UserSessionRequest) =>
  (await api.post('v1/sessions', { ...data, role: 'admin' })) as ApiResponse<UserSessionResponse>
export const refreshSession = async (data: string) =>
  (await api.get(`v1/refreshToken/${data}`)) as ApiResponse<UserSessionResponse>

// User Methods
export const getUsers = async (data?: GetUsersRequest) =>
  (await api.get('v1/user', data)) as ApiResponse<GetUsersResponse>
export const postUser = async (data: PostUserRequest) =>
  (await api.post('v1/user', data)) as ApiResponse<PostUserResponse>
export const getUser = async (id: string) => (await api.get(`v1/user/${id}`)) as ApiResponse<PostUserRequest>
export const updateUser = async (data: PostUserRequest) =>
  (await api.put('v1/user', data)) as ApiResponse<PostUserResponse>
export const deleteUser = async (id: string) =>
  (await api.delete(`v1/user/${id}`)) as ApiResponse<GenericDeleteResponse>

// Erp methods
export const getErps = async (data?: BasicFilterRequest) =>
  (await api.get('v1/erp', data)) as ApiResponse<GetErpsResponse>
export const getErp = async (id: string) => (await api.get(`v1/erp/${id}`)) as ApiResponse<GetErpResponse>

export const deleteErp = async (_id: string) => (await api.delete(`v1/erp/${_id}`)) as ApiResponse<BasicDeleteResponse>
export const updateErp = async (erp: Erp) => (await api.post(`v1/erp`, { erp })) as ApiResponse<UpdateErpResponse>
export const createErp = async (erp: Erp) => (await api.put(`v1/erp`, { erp })) as ApiResponse<UpdateErpResponse>

export const getErpVersions = async (data?: BasicFilterRequest) =>
  (await api.get('v1/erp/version', data)) as ApiResponse<GetErpResponse>

// Store
export const getStores = async (data?: GetStoresRequest) =>
  (await api.get('/v1/store', data)) as ApiResponse<GetStoresResponse>
export const putStore = async (data?: PutStoreRequest) =>
  (await api.put('/v1/store', data)) as ApiResponse<GetStoreResponse>

export const getApiIntegration = async (_id: Store['_id']) =>
  (await api.post(`/v1/integration-api/`, { _id }) as ApiResponse<GetApiIntegrationResponse>)

export const putApiIntegration = async (_id: Store['_id'], integrationData: any) =>
  (await api.put('/v1/integration-api', { _id, integrationData })) as ApiResponse<any>

export const postStore = async (storeId: string, data?: PutStoreRequest) =>
  (await api.post(`/v1/store/${storeId}`, data)) as ApiResponse<GetStoreResponse>

export const getStore = async (_id: Store['_id']) =>
  (await api.get(`/v1/store/${_id}`)) as ApiResponse<GetStoreResponse>

export const deleteStore = async (_id: Store['_id']) =>
  (await api.delete(`/v1/store/${_id}`)) as ApiResponse<GenericDeleteResponse>

export const getStoresReport = async (data?: RequestStoresReport) =>
  (await api.post(`/v1/store/report`, {}, { params: data })) as ApiResponse<GetStoresReport>

// GMV
export const getGMVReport = async (data?: RequestGMVReport) =>
  (await api.post(`/v1/store/reportgmv`, {}, { params: data })) as ApiResponse<GetGMVReport>

export const getStoresGmvReport = async (data: any) => await api.get('/v1/store/report/gmv', data) as ApiResponse<ResponseStoresReportGmv>

export const putMainStore = async (storeId: string, data: PutStoreRequest) => await api.put(`/v1/store/mainstore/${storeId}`, data) as ApiResponse<GetStoreResponse>

// Plans
export const getPlans = async () => (await api.get('v1/plan')) as ApiResponse<GetPlansResponse>
export const deletePlan = async (id: Plan['_id'] | string) =>
  (await api.delete(`v1/plan/${id}`)) as ApiResponse<GenericDeleteResponse>
export const updatePlan = async (data: PutStorePlanRequest) =>
  (await api.put('v1/plan', data)) as ApiResponse<GetPlanResponse>
export const createPlan = async (data: PutStorePlanRequest) =>
  (await api.post('v1/plan', data)) as ApiResponse<GetPlanResponse>

// StoreGroups
export const getStoreGroups = async (data?: GetStoreGroupsRequest) =>
  (await api.get('v1/storeGroups')) as ApiResponse<GetStoreGroupsResponse>

// Category
export const getCategory = async (data?: GetCategoryRequest) =>
  (await api.get('v1/category', data)) as ApiResponse<GetCategoryResponse>

// Customer
export const removeCpfIndexes = async (data?: GetRemoveCpfIndexes) =>
  (await api.get('v1/customer', data)) as ApiResponse<RemoveCpfIndexes>

// Product
export const getProduct = async (data?: GetProductRequest) =>
  (await api.get('v1/product', data)) as ApiResponse<GetProductsResponse>
export const createProduct = async (data: PostProductRequest) =>
  (await api.post('v1/product', data)) as ApiResponse<GetProductResponse>
export const deleteProduct = async (id: string) =>
  (await api.delete(`v1/product/${id}`)) as ApiResponse<GenericDeleteResponse>
export const updateProduct = async (data: PostProductRequest) =>
  (await api.put('v1/product', data)) as ApiResponse<GetProductResponse>
export const getProductDetail = async (id: string) =>
  (await api.get(`v1/product/${id}`)) as ApiResponse<GetProductResponse>
export const updateStoreProductsControl = async (data: PostUpdateStoreProductsControlRequest) =>
  (await api.put(`/v1/product/storeUpdateControls`, data)) as ApiResponse<ResponseUpdateStoreProductsControlRequest>

// Product
export const getPmcs = async (data?: BasicFilterRequest) => (await api.get('v1/pmc', data)) as ApiResponse<PmcResponse>

// Billboard
export const getBillboard = async (id?: string) =>
  (await api.get(`/v1/billboard${id ? `/${id}` : ''}`)) as ApiResponse<GetBillboardResponse>
export const putBillboard = async (data: PutBillboardRequest) =>
  (await api.put('/v1/billboard', data)) as ApiResponse<PutBillboardResponse>

export const deleteBillboard = async (id: Billboard['_id']) =>
  (await api.delete(`/v1/billboard/${id}`)) as ApiResponse<any>

// Import PMC api
export const importPmc = async (data: any) => (await api.put('v1/upload/pmc', data)) as ApiResponse<PostPmcResponse>

export const getManufacturers = async ({ name }: any) =>
  (await api.get('/v1/manufacturer', { name })) as ApiResponse<GetManufacturerResponse>

export const getIntegrationsLog = async (data: GetIntegrationLogRequest) => await api.get('/v1/store/integration', data) as ApiResponse<GetIntegrationLogResponse>

export const getIntegrationsReport = async (data?: IntegrationStoresReport) =>
  (await api.post(`/v1/store/integration`, {}, { params: data })) as ApiResponse<GetIntegrationsReportResponse>

export const getControl = async () => (await api.get('/v1/control')) as ApiResponse<GetControlResponse>
export const getClassification = async () =>
  (await api.get('/v1/classification')) as ApiResponse<GetClassificationResponse>


// SDRs
export const getSDRs = async (data?: GetSDRsRequest) =>
  (await api.get('v1/sdrs', data)) as ApiResponse<GetSDRsResponse>
export const getSDR = async (id: string) =>
  (await api.get(`v1/sdrs/${id}`)) as ApiResponse<GetSDRResponse>
export const postSDR = async (data: PostSDRRequest) =>
  (await api.post('v1/sdrs', data)) as ApiResponse<PostSDRResponse>
export const updateSDR = async (data: PostSDRRequest) =>
  (await api.put('v1/sdrs', data)) as ApiResponse<PostSDRResponse>
export const deleteSDR = async (id: string) =>
  (await api.delete(`v1/sdrs/${id}`)) as ApiResponse<GenericDeleteResponse>

// Leads
export const getLeads = async (data?: GetLeadsRequest) =>
  (await api.get('v1/leads', data)) as ApiResponse<GetLeadsResponse>
export const getLead = async (id: string) =>
  (await api.get(`v1/leads/${id}`)) as ApiResponse<GetLeadResponse>
export const updateLead = async (data: PostLeadRequest) =>
  (await api.put('v1/leads', data)) as ApiResponse<PostLeadResponse>
export const deleteLead = async (id: string) =>
  (await api.delete(`v1/leads/${id}`)) as ApiResponse<GenericDeleteResponse>
export const getLeadsReport = async (data?: LeadsReportRequest) =>
  (await api.post(`/v1/leads`, {}, { params: data })) as ApiResponse<GetIntegrationsReportResponse>
