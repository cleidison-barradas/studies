import { create, HEADERS } from 'apisauce'
import axios from 'axios'
import { AuthApi } from '../../config'
import Banner from '../../interfaces/banner'
import Cupom from '../../interfaces/cupom'
import Customer from '../../interfaces/customer'
import Mockups from '../../interfaces/mockups'
import PaymentLinkForm from '../../interfaces/paymentLinkForm'
import PaymentLinkInformationsResponse from '../../interfaces/paymentLinkInformationsResponse'
import Product from '../../interfaces/product'
import { ISender } from '../../interfaces/sender'
import Showcase from '../../interfaces/showcase'
import Store from '../../interfaces/store'
import StoreIntegration from '../../interfaces/storeIntegration'
import Tenant from '../../interfaces/tenant'
import {
  EpharmaRequest,
  IMarketingAutomationRequest,
  PutCovenantMethodRequest,
  PutGatewayMethodRequest,
  RequestAddImage,
  RequestClassifications,
  RequestGetManufacturer,
  RequestGetPaymentLinks,
  RequestGetPayments,
  RequestIFoodOrders,
  RequestPutCupom,
  RequestPutOrderDispatch,
  RequestPutOrderFiscalDocument,
  RequestPutPayment,
  RequestPutPaymentOption,
  RequestRecurringCard,
  RequestReport,
  RequestSalesHistory,
  UpdatedProductStatusRequest,
  UpdateProductCategory,
} from './interfaces/ApiRequest'

import { StoreBranchPickupForm } from '../../interfaces/storeBranchPickup'
import {
  AboutUsResponse,
  ApiResponse,
  BillboardResponse,
  CustomerResponse,
  DeleteBannerResponse,
  DeleteCupom,
  DeleteCustomers,
  Deleted,
  DeletedCovenantMethod,
  DeletedGatewayMethod,
  DeletedPaymentLink,
  DeleteImports,
  DeliveryScheduleResponse,
  EpharmaResponse,
  EventsResponse,
  FileResponse,
  GetAdminNotifications,
  GetBannerResponse,
  GetCategorys,
  GetCovenantMethod,
  GetCupoms,
  GetCustomerProductOrders,
  GetCustomers,
  GetGanalytics,
  GetGatewaysMethod,
  GetImports,
  GetIntegrationSql,
  GetLayoutResponse,
  GetManufacturers,
  GetNotification,
  GetProducts,
  GetShowcases,
  GetStoreIntegration,
  GetVirtualProducts,
  IFoodOrderDetailResponse,
  IFoodOrdersResponse,
  IFoodReportResponse,
  IIntegrationModuleResponse,
  IMarketingAutomationResponse,
  ImportHistoryResponse,
  IntegrationResponse,
  InvoicesPendingResponse,
  MostVisitedPagesResponse,
  OrderResponse,
  OrderStatisticsResponse,
  PaymentLinkResponse,
  PaymentMethodsResponse,
  PaymentOptionResponse,
  PbmPreOrderResponse,
  PostBannerResponse,
  PostCupom,
  PostLayoutResponse,
  PostShowcase,
  PostStoreIntegration,
  ProductClassification,
  ProductControlResponse,
  PutCupom,
  PutGanalytics,
  PutShowcase,
  PwaInstallationsResponse,
  ReportReponse,
  ResponsePutPayment,
  RouteLinkResponse,
  StoreBranchPickupResponse,
  StoreDeliveryResponse,
  StoreGroupResponse,
  StoreInfoResponse,
  StoreResponse,
  StoreSettingsResponse,
  TotalUsersResponse,
  TrackingShippingResponse,
  UserSessionResponse,
  UserSetTenantResponse,
  UserTenantResponse,
  StatusVirtualDocksResponse,
  NotificationVirtualDocksResponse,
} from './interfaces/ApiResponse'

const api = create({
  baseURL: AuthApi,
})

export const authApi = create({
  baseURL: AuthApi,
})

export const setHeaders = (opts: HEADERS) => api.setHeaders(opts)
export const setURL = (url: string) => api.setBaseURL(url)
export const setToken = (token: string) => api.setHeader('Authorization', `Bearer ${token}`)

export const sessionRequest = async (data: any) => (await api.post('v1/sessions', data)) as ApiResponse<UserSessionResponse>
export const userTenantList = async () => (await api.get('v1/userTenants')) as ApiResponse<UserTenantResponse>
export const userSetTenant = async (tenant: Tenant['_id']) =>
  (await api.get(`v1/userSetTenants/${tenant}`)) as ApiResponse<UserSetTenantResponse>
export const refreshSession = async (refreshToken: string) =>
  (await api.get(`v1/refreshToken/${refreshToken}`)) as ApiResponse<UserSessionResponse>

export const getTotalUsers = async (data: any) =>
  (await api.get('v1/ganalytics/getinfo', data)) as ApiResponse<TotalUsersResponse>
export const getMostVistedPages = async (data: any) =>
  (await api.get('v1/ganalytics/getinfo', data)) as ApiResponse<MostVisitedPagesResponse>
export const getEvents = async (data: any) => (await api.get('v1/ganalytics/getinfo', data)) as ApiResponse<EventsResponse>
export const putAnalytics = async (data: any, id?: string) =>
  (await api.put(`v1/ganalytics/${id ? id : ''}`, data)) as ApiResponse<PutGanalytics>
export const getAnalytics = async (id?: string) => (await api.get(`v1/ganalytics/${id ? id : ''}`)) as ApiResponse<GetGanalytics>
export const getPwaInstallations = async () =>
  (await api.get('v2/pwaInstallations/getInstallations')) as ApiResponse<PwaInstallationsResponse>

export const getOrderStatistics = async (data: any) =>
  (await api.get('v1/statistcOrder', data)) as ApiResponse<OrderStatisticsResponse>
export const getOrders = async (data: any) => (await api.get('v1/order', data)) as ApiResponse<OrderResponse>
export const alterOrder = async (id: any, data: any) =>
  (await api.post(`v1/order/${id}`, data)) as ApiResponse<OrderResponse['order']>
export const getHistoryStatusOrder = async (data?: any) =>
  (await api.get('v1/historyOrder', data)) as ApiResponse<OrderResponse['historyOrders']>
export const getSalesHistory = async (data?: RequestSalesHistory) =>
  (await api.get('v1/salesHistory', data)) as ApiResponse<OrderResponse['salesHistory']>
export const getSaleDetail = async (id: any) =>
  (await api.get(`v1/salesHistory/${id}`)) as ApiResponse<OrderResponse['saleHistory']>
export const getStatusOrder = async () => (await api.get('v1/statusOrder')) as ApiResponse<OrderResponse['status']>
export const deleteOrder = async (data: any) =>
  (await api.post('v1/orders/delete', data)) as ApiResponse<OrderResponse['deletedId']>
export const getStore = async (_id: Store['_id']) => (await api.get(`v1/store/${_id}`)) as ApiResponse<StoreResponse>
export const postSettings = async (settings: Store['settings'], _id: Store['_id']) =>
  (await api.post(`v1/store/${_id}`, { settings })) as ApiResponse<StoreResponse>
export const updateNfeData = async (_id: any, nfe_data: any) => {
  return (await api.put(`/v1/order/invoice/${_id}`, nfe_data)) as ApiResponse<any>
}
// set on order fiscal document
export const putOrderFiscalDocument = async ({ orderId, fiscalDocument }: RequestPutOrderFiscalDocument) => {
  return (await api.put(`/v1/order/invoice/${orderId}`, fiscalDocument)) as ApiResponse<OrderResponse['saleHistory']>
}
export const updateShippingData = async (_id: any, shippingData: any) => {
  return (await api.put(`/v1/order/shipping/${_id}`, shippingData)) as ApiResponse<any>
}
// set on order order shipping dispatch
export const putOrderDispatch = async ({ orderId, orderDispatch }: RequestPutOrderDispatch) => {
  return (await api.put(`/v1/order/shipping/${orderId}`, orderDispatch)) as ApiResponse<OrderResponse['saleHistory']>
}

export const getStoreGroups = async () => (await api.get('v1/stores/group')) as ApiResponse<StoreGroupResponse['groups']>
export const getStoreList = async () => (await api.get('v1/stores/group/stores')) as ApiResponse<StoreGroupResponse['stores']>
export const addStoreGroup = async (data: any) =>
  (await api.put('v1/stores/group', data)) as ApiResponse<StoreGroupResponse['groups']>
export const addStoreUrls = async (data: any) =>
  (await api.post('v1/stores/group/urls', data)) as ApiResponse<StoreGroupResponse['storeUrls']>
export const getStoreUrls = async () => (await api.get('v1/stores/group/urls')) as ApiResponse<StoreGroupResponse['storeUrls']>
export const deleteStoreGroup = async (groupId: string) =>
  (await api.delete(`v1/stores/group/${groupId}`)) as ApiResponse<StoreGroupResponse['deletedId']>
export const getBanners = async () => (await api.get('v1/banner')) as ApiResponse<GetBannerResponse>
export const putBanners = async (banners: Banner[]) => (await api.put('v1/banner', banners)) as ApiResponse<GetBannerResponse>
export const deleteBanners = async (banners: Banner[]) => (await api.delete('v1/banner')) as ApiResponse<DeleteBannerResponse>
export const postBanners = async (banners: Banner[]) => (await api.post(`v1/banner`, banners)) as ApiResponse<PostBannerResponse>
export const getLayout = async (id: Store['_id']) => (await api.get(`v1/storeLayout/${id}`)) as ApiResponse<GetLayoutResponse>
export const postLayout = async (id: Store['_id'], data: any) =>
  (await api.post(`v1/storeLayout/${id}`, data)) as ApiResponse<PostLayoutResponse>
export const updateTextBanner = async (id: Store['_id'], data: any) =>
  (await api.put(`v1/storeLayout/bannerWithText/${id}`, data)) as ApiResponse<any>
export const getShowcases = async (data?: any, id?: Showcase['_id']) =>
  (await api.get(`v1/showcase/${id ? id : ''}`, data)) as ApiResponse<GetShowcases>
export const updateShowcases = async (showcases: Showcase[]) => await api.post('/v1/showcase', { showcases })
export const postShowcase = async (showcase: Partial<Showcase>) =>
  (await api.post(`v1/showcase/${showcase['_id']}`, showcase)) as ApiResponse<PostShowcase>
export const deleteShowcase = async (id: any) => (await api.delete(`v1/showcase/${id}`)) as ApiResponse<Deleted>
export const putShowcase = async (showCase: Showcase) => (await api.put('v1/showcase', showCase)) as ApiResponse<PutShowcase>
export const addProductsToShowcase = async (products: Product['_id'][]) =>
  (await api.post('v1/showcase/push/products', { products })) as ApiResponse<PutShowcase>
export const getProducts = async (data?: any) => (await api.get('v1/product', data)) as ApiResponse<GetProducts>
export const getProductDetail = async (id?: any) =>
  (await api.get(`v1/product/${id || ''}`)) as ApiResponse<GetProducts['product']>
export const addProducts = async (data: any) => (await api.put('v1/product', data)) as ApiResponse<GetProducts['product']>
export const alterProducts = async (products: Product | Product[]) =>
  (await api.post('v1/product', { products })) as ApiResponse<GetProducts['products']>
export const deleteProducts = async (id: string[]) =>
  (await api.post('v2/products/delete', { id })) as ApiResponse<GetProducts['deletedId']>

export const getVirtualProducts = async (data?: any) =>
  (await api.get('v1/virtualProduct', data)) as ApiResponse<GetVirtualProducts>
export const alterVirtualProducts = async (products: Product | Product[]) =>
  (await api.post('v1/virtualProduct', { products })) as ApiResponse<GetVirtualProducts['virtualProducts']>

export const getAdminNotification = async (data?: any) =>
  (await api.get('v2/notification', data)) as ApiResponse<GetAdminNotifications>

export const updateProductStatus = async (data: UpdatedProductStatusRequest) =>
  (await api.post('/v1/product/status', data)) as ApiResponse<GetProducts['products']>

export const updateProductCategory = async (data: UpdateProductCategory) =>
  (await api.put('v2/products/category', data)) as ApiResponse<GetProducts['products']>

export const getManufacturers = async (data?: RequestGetManufacturer) =>
  (await api.get(`v1/manufacturer/${data?.id ? data?.id : ''}`, data)) as ApiResponse<GetManufacturers>

export const getProdcutControls = async (data?: any) =>
  (await api.get('v1/productControl', data)) as ApiResponse<ProductControlResponse['productControls']>

export const getClassifications = async (data?: RequestClassifications) =>
  (await api.get(`v1/productClassification/${data?.id || ''}`, data)) as ApiResponse<ProductClassification>

export const getCategorys = async (data?: any, id?: string) =>
  (await api.get(`v1/category/${id || ''}`, data)) as ApiResponse<GetCategorys>
export const addCategory = async (data: any) => (await api.put('v1/category', data)) as ApiResponse<GetCategorys['category']>
export const alterCategory = async (id?: string, data?: any) =>
  (await api.post(`v1/category/${id || ''}`, data)) as ApiResponse<GetCategorys['category']>
export const deleteManyCategory = async (data: any) =>
  (await api.post('v1/categories/delete', data)) as ApiResponse<GetCategorys['deletedId']>
export const updateManyCategory = async (data: any) =>
  (await api.post('v1/categories/update', data)) as ApiResponse<GetCategorys['categorys']>
export const getAboutUs = async (id?: string, page?: any, limit?: any) =>
  (await api.get(`v1/aboutUs/${id || ''}`, { page, limit })) as ApiResponse<AboutUsResponse[]>
export const addAboutUs = async (data: any) => (await api.put(`v1/aboutUs/`, data)) as ApiResponse<AboutUsResponse[]>
export const alterAboutUs = async (id: string, data: any) =>
  (await api.post(`v1/aboutUs/${id}`, data)) as ApiResponse<AboutUsResponse[]>
export const deleteAboutUs = async (id: string) =>
  (await api.delete(`v1/aboutUs/${id}`)) as ApiResponse<AboutUsResponse['deltedtId']>
export const getDeliverySchedule = async () => (await api.get('v1/deliverySchedule')) as ApiResponse<DeliveryScheduleResponse[]>
export const addDeliverySchedule = async (data: any) =>
  (await api.put('v1/deliverySchedule', data)) as ApiResponse<DeliveryScheduleResponse[]>
export const getAverageDeliveryTime = async () => await api.get('v1/deliverySchedule/average_delivery_time')
export const addAverageDeliveryTime = async (data: any) => await api.post('v1/deliverySchedule/average_delivery_time', data)
export const deleteDeliverySchedule = async (id: any) =>
  (await api.delete(`v1/deliverySchedule/${id}`)) as ApiResponse<DeliveryScheduleResponse['deletedId']>
export const getStoreInfo = async () => (await api.get(`v1/store`)) as ApiResponse<StoreInfoResponse>
export const getPayments = async ({ id, page, limit }: RequestGetPayments) =>
  (await api.get(`v1/paymentMethods/store/${id || ''}`, { page, limit })) as ApiResponse<PaymentMethodsResponse['payments']>
export const getPaymentsOption = async () =>
  (await api.get(`v1/paymentOption/`)) as ApiResponse<PaymentOptionResponse['paymentOptions']>
export const addPaymentOption = async (data: RequestPutPaymentOption) =>
  (await api.put(`v1/paymentOption/`, data)) as ApiResponse<PaymentOptionResponse['paymentOption']>
export const putPayment = async (data: RequestPutPayment) =>
  (await api.put(`v1/paymentMethods`, data)) as ApiResponse<ResponsePutPayment>

export const putPix = async (data: FormData) =>
  (await api.put(`v1/paymentMethods/pix`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })) as ApiResponse<ResponsePutPayment>

export const deletePayments = async (_id: string) =>
  (await api.delete(`v1/paymentMethods/${_id}`)) as ApiResponse<PaymentMethodsResponse['deletedId']>

export const addStoreSettings = async (data: any) =>
  (await api.post(`v1/store/settings`, data)) as ApiResponse<StoreSettingsResponse>
export const getImports = async (data: any, id?: string) =>
  (await api.get(`/import/${id || ''}`, data)) as ApiResponse<GetImports>
export const deleteImports = async (data: any) => (await api.post('/import', data)) as ApiResponse<DeleteImports>
export const getImportHistory = async (id?: string, data?: any) =>
  (await api.get(`v1/history/imports/${id || ''}`, data)) as ApiResponse<ImportHistoryResponse['importHistory']>
export const putImportPromotions = async (data: any) =>
  (await api.post('v1/upload/promotions', data)) as ApiResponse<ImportHistoryResponse['ok']>
export const putImportProducts = async (data: any) =>
  (await api.post('v1/upload/products', data)) as ApiResponse<ImportHistoryResponse['ok']>
export const deleteImportProducts = async (id: string) =>
  (await api.delete(`v1/history/${id}`)) as ApiResponse<ImportHistoryResponse['ok']>

export const getCustomers = async (data: any, id?: string) =>
  (await api.get(`v1/customer/${id || ''}`, data)) as ApiResponse<GetCustomers>
export const deleteCustomers = async (data: any, id?: string) =>
  (await api.delete(`v1/customer/${id || ''}`, data)) as ApiResponse<DeleteCustomers>
export const getCustomerOrderProducts = async (id: Customer['_id']) =>
  (await api.get(`v1/customer/statistics/order/products/${id}`)) as ApiResponse<GetCustomerProductOrders>
export const getStoreDeliveries = async (id?: string, page?: any, limit?: any, query?: string) =>
  (await api.get(`v1/deliveryFee/${id || ''}`, { page, limit, query })) as ApiResponse<StoreDeliveryResponse['deliveryFees']>
export const getStoreDistanceDeliveries = async () =>
  (await api.get(`v1/distanceDeliveryFee`)) as ApiResponse<StoreDeliveryResponse['distanceDeliveryFees']>
export const saveStoreDeliveries = async (data: any) =>
  (await api.post(`v1/deliveryFee/`, data)) as ApiResponse<StoreDeliveryResponse['deliveryFees']>
export const saveStoreDistanceDeliveries = async (data: any) =>
  (await api.post(`v1/distanceDeliveryFee/`, data)) as ApiResponse<StoreDeliveryResponse['distanceDeliveryFees']>
export const deleteStoreDeliveries = async (data: any) =>
  (await api.post(`v1/storeDelivery/delete`, data)) as ApiResponse<StoreDeliveryResponse['deletedId']>
export const deleteStoreDistanceDeliveries = async (data: any) =>
  (await api.post(`v1/distanceDeliveryFee/delete`, data)) as ApiResponse<StoreDeliveryResponse['deletedId']>
export const getStateDeliveries = async (id?: string) =>
  (await api.get(`v1/storeDelivery/states/${id || ''}`)) as ApiResponse<StoreDeliveryResponse['states']>
export const getCitiesDeliveries = async (id?: string) =>
  (await api.get(`v1/storeDelivery/cities/${id || ''}`)) as ApiResponse<StoreDeliveryResponse['cities']>
export const getNeighborhoodsDeliveries = async (id?: string) =>
  (await api.get(`v1/storeDelivery/neighborhoods/${id || ''}`)) as ApiResponse<StoreDeliveryResponse['neighborhoods']>
export const addNeighborhood = async (data: any) =>
  (await api.put(`v1/storeDelivery/neighborhoods`, data)) as ApiResponse<StoreDeliveryResponse['neighborhood']>
export const getIntegrationSql = async (data?: any, id?: string) =>
  (await api.get(`v1/integrationsql/${id || ''}`, data)) as ApiResponse<GetIntegrationSql>
export const getCupoms = async (data?: any) => (await api.get('v1/cupom', data)) as ApiResponse<GetCupoms>
export const deleteCupom = async (id: string) => (await api.delete(`v1/cupom/${id}`)) as ApiResponse<DeleteCupom>
export const putCupom = async (data: RequestPutCupom) => (await api.put('v1/cupom', data)) as ApiResponse<PutCupom>
export const postCupom = async (cupom: Cupom) => (await api.post(`v1/cupom/${cupom._id}`, cupom)) as ApiResponse<PostCupom>
export const getStoreIntegration = async () => (await api.get('v1/storeintegration')) as ApiResponse<GetStoreIntegration>
export const postStoreIntegration = async (data: StoreIntegration) =>
  (await api.post('v1/storeintegration', data)) as ApiResponse<PostStoreIntegration>
export const getIntegration = async () => (await api.get('/v1/integration')) as ApiResponse<IntegrationResponse>

export const getApiIntegration = async () => (await api.get('/v1/integration/api')) as ApiResponse<any>

// File Methods
export const addFiles = async ({ folder, file }: RequestAddImage) =>
  (await api.post(`v1/file`, { folder, file })) as ApiResponse<FileResponse>

export const deleteFiles = async (id: string) => (await api.delete(`v1/file/${id}`)) as ApiResponse<FileResponse['deletedId']>
export const getMocks = async () => (await api.get(`v1/file/mockups`)) as ApiResponse<any>
export const updateMocks = async (data: Mockups) => (await api.put(`v1/file/mockups`, { mockups: data })) as ApiResponse<any>
export const getProductPromotions = async (id?: string, data?: any) =>
  (await api.get(`v1/products/promotion/${id || ''}`, data)) as ApiResponse<Product[]>
export const addProductPromotions = async (data: any) => (await api.put(`v1/products/promotion`, data)) as ApiResponse<Product>
export const deleteProductPromotions = async (id: string) =>
  (await api.delete(`v1/products/promotion/${id}`)) as ApiResponse<Product['_id']>
export const getBillboard = async () => (await api.get('/v1/billboard')) as ApiResponse<BillboardResponse>
export const getReport = async ({ type, ...data }: RequestReport) =>
  (await api.get(`/v1/report/${type}`, data)) as ApiResponse<ReportReponse>
export const getiFoodReports = async () => (await api.get(`/v1/report/ifood`)) as ApiResponse<IFoodReportResponse>

export const getIFoodOrders = async (data?: RequestIFoodOrders) =>
  (await api.get(`/v2/ifood/`, data)) as ApiResponse<IFoodOrdersResponse>
export const getIFoodOrderDetail = async (cod: string) =>
  (await api.get(`/v2/ifood/${cod}`)) as ApiResponse<IFoodOrderDetailResponse>
export const deleteIFoodOrder = async (id: string) => (await api.delete(`/v1/order/ifood/${id}`)) as ApiResponse<any>

export const getTrackingShipping = async (sender: ISender, trackingCode: string) =>
  (await api.get(`v1/shipping/tracking/${sender}/${trackingCode}`)) as ApiResponse<TrackingShippingResponse['tracking']>

export const getRouteLinks = async () => (await api.get('/v1/route/links')) as ApiResponse<RouteLinkResponse['links']>

export const requestAccessToken = async (code: string) => (await api.get(`/v1/melhorenvio/${code}`)) as ApiResponse<any>

export const postGenerateToken = async (storeId: string, email: string) =>
  (await api.post('/v2/token/generate', { storeId, email })) as ApiResponse<any>

export const getMarketingAutomations = async () =>
  (await api.get('/v1/marketing/automations')) as ApiResponse<IMarketingAutomationResponse>

export const putMarketingAutomations = async (data: IMarketingAutomationRequest) =>
  (await api.put('/v1/marketing/automations', data)) as ApiResponse<IMarketingAutomationResponse>

export const putMailCustomers = async (data: IMarketingAutomationRequest) =>
  (await api.put('/v1/marketing/mail/customers', data)) as ApiResponse<IMarketingAutomationResponse>

export const getIntegrationModule = async (code?: string) =>
  (await api.get(`/v1/integration/module/${code || ''} `)) as ApiResponse<IIntegrationModuleResponse>

export const putSettingsEpharma = async (data: EpharmaRequest) =>
  (await api.put('/v1/store/settings/epharma', data)) as ApiResponse<EpharmaResponse>

export const getExternalIntegrationData = async (integration: string) =>
  (await api.get(`/v1/integration/external/${integration} `)) as ApiResponse<any>
export const putExternalIntegrationData = async (integration: string, data: {}) =>
  (await api.put(`/v1/integration/external/${integration} `, data)) as ApiResponse<any>

export const getImport = async (data: any) => (await api.get('/v1/upload/imports')) as ApiResponse<any>
export const importProducts = async (data: FormData) => (await api.post('/v1/upload/products', data)) as ApiResponse<any>
export const importCustomers = async (data: FormData) => (await api.post('/v1/upload/customer', data)) as ApiResponse<any>

export const postPaymentLink = async (data?: PaymentLinkForm) =>
  (await api.post(`/v2/paymentLinks`, data)) as ApiResponse<PaymentLinkResponse['link']>
export const getPaymentLinks = async (data?: RequestGetPaymentLinks) =>
  (await api.get(`/v2/paymentLinks`, data)) as ApiResponse<PaymentLinkResponse>
export const getCartByPaymentLink = async (id: string) =>
  (await api.get(`/v2/paymentLinks/${id}`)) as ApiResponse<PaymentLinkInformationsResponse>
export const deletePaymentLink = async (id: string) =>
  (await api.delete(`/v2/paymentLinks/${id}`)) as ApiResponse<DeletedPaymentLink>

// PaymentMethods - Covenant
export const getCovenantMethod = async (id?: string) =>
  (await api.get(`/v2/paymentMethod/covenant`)) as ApiResponse<GetCovenantMethod>
export const putCovenantMethod = async (data: PutCovenantMethodRequest) =>
  (await api.get(`/v2/paymentMethod/covenant`, data)) as ApiResponse<PutCovenantMethodRequest>
export const deleteCovenantMethod = async (id: string) =>
  (await api.delete(`/v2/paymentMethod/covenant/${id}`)) as ApiResponse<DeletedCovenantMethod>

// PaymentMethods - Gateways
export const getGatewaysMethod = async () => (await api.get(`/v2/paymentMethod/gateways`)) as ApiResponse<GetGatewaysMethod>
export const putGatewayMethod = async (data: PutGatewayMethodRequest) =>
  (await api.put(`/v2/paymentMethod/gateways`, data)) as ApiResponse<PutGatewayMethodRequest>
export const deleteGatewayMethod = async (id: string) =>
  (await api.delete(`/v2/paymentMethod/gateways/${id}`)) as ApiResponse<DeletedGatewayMethod>

export const putRecurringCard = async (data: RequestRecurringCard, customerId: number) =>
  await api.put(`/customer/${customerId}/creditCard`, data)

export const getInvoicesPending = async (cnpj: string) =>
  (await api.get(`/customer/invoice/${cnpj}`)) as ApiResponse<InvoicesPendingResponse[]>

export const getIssuedNfes = async (cnpj: string) =>
  (await api.get(`/customer/nfe/${cnpj}`)) as ApiResponse<InvoicesPendingResponse[]>

export const getCustomer = async (cnpj: string) =>
  (await api.get(`/customer`, {
    cnpj,
  })) as ApiResponse<CustomerResponse[]>

export const getNotification = async (storeId: string) =>
  (await api.get(`/notification/${storeId}`)) as ApiResponse<GetNotification>

export const getStoreBranches = async ({ id, page, limit }: RequestGetPayments) =>
  (await api.get(`v2/storeBranchPickup/${id || ''}`, { page, limit })) as ApiResponse<StoreBranchPickupResponse['storeBranches']>
export const postStoreBranchPickup = async (data?: StoreBranchPickupForm) =>
  (await api.post(`/v2/storeBranchPickup`, data)) as ApiResponse<StoreBranchPickupResponse['storeBranch']>
export const deleteStoreBranchPickup = async (id: string) =>
  (await api.delete(`/v2/storeBranchPickup/${id}`)) as ApiResponse<StoreBranchPickupResponse['storeBranch']>

export const getPbmPreOrder = async (orderId: string) => (await api.get(`/v1/pbm/${orderId}`)) as ApiResponse<PbmPreOrderResponse>

export const getStatusVirtualDocks = async () => api.get<StatusVirtualDocksResponse>(`/v2/virtualDocks/status`)

export const activeVirtualDocks = (cnpj: string, tenant: string) =>
  axios.post(`${process.env.REACT_APP_MAIDEN_DOCAS}/docas/integrate`, { cnpj, tenant })

export const disableVirtualDocks = (tenant: string) =>
  axios.patch(`${process.env.REACT_APP_MAIDEN_DOCAS}/docas/disintegrate`, { tenant })

export const getVirtualDocksNotification = async () => api.get<NotificationVirtualDocksResponse>(`/v2/virtualDocks/notification`)
