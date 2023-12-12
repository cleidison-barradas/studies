import AboutUs from '../../../interfaces/aboutus'
import Banner from '../../../interfaces/banner'
import IBillboard from '../../../interfaces/billboard'
import Category from '../../../interfaces/category'
import City from '../../../interfaces/city'
import Classification from '../../../interfaces/classification'
import Control from '../../../interfaces/control'
import Cupom from '../../../interfaces/cupom'
import Customer from '../../../interfaces/customer'
import DeliveryFee from '../../../interfaces/deliveryFee'
import DeliverySchedule from '../../../interfaces/deliverySchedule'
import DistanceDeliveryFee from '../../../interfaces/distanceDeliveryFee'
import Erp from '../../../interfaces/erp'
import File from '../../../interfaces/file'
import GAnalytics from '../../../interfaces/ganalytics'
import HistoryOrderStatus from '../../../interfaces/historyOrderStatus'
import Import from '../../../interfaces/import'
import { Integration } from '../../../interfaces/integration'
import IntegrationSql from '../../../interfaces/integrationSql'
import Manufacturer from '../../../interfaces/manufacturer'
import { Neighborhood } from '../../../interfaces/neighborhood'
import Order from '../../../interfaces/order'
import OrderStatus from '../../../interfaces/orderStatus'
import PaymentMethods from '../../../interfaces/paymentMethods'
import PaymentOptions from '../../../interfaces/paymentOption'
import Product from '../../../interfaces/product'
import ProductOrder from '../../../interfaces/productOrder'
import Showcase from '../../../interfaces/showcase'
import State from '../../../interfaces/state'
import Store from '../../../interfaces/store'
import StoreGroup from '../../../interfaces/storeGroups'
import StoreIntegration from '../../../interfaces/storeIntegration'
import Setting from '../../../interfaces/storeSettings'
import StoreUrls from '../../../interfaces/storeUrls'
import Tenant from '../../../interfaces/tenant'

import { IFoodDetail, IFoodOrder, IFoodReport } from '../../../interfaces/ifood'
import ImportHistory from '../../../interfaces/importHistory'
import IntegrationModule from '../../../interfaces/integrationModule'
import MarketingAutomations from '../../../interfaces/marketingAutomations'
import PaymentLink from '../../../interfaces/paymentLink'
import { IPbmPreOrder } from '../../../interfaces/pbm'
import PwaInstallation from '../../../interfaces/pwaInstallation'
import RouteLink from '../../../interfaces/routeLink'
import { StoreBranchPickup } from '../../../interfaces/storeBranchPickup'
import Tracking from '../../../interfaces/tracking'

export interface ApiResponse<T> {
  ok: boolean
  problem: string
  data: T | any | null
  status: number
}

interface Pagination {
  total: number
  limit: number
  pages: number
  currentPage: number
  prevPage: any
  nextPage: any
}

export interface UserSessionResponse {
  accessToken: string
  refreshToken: string
}

export interface UserTenantResponse {
  tenants: Tenant[]
}

export interface UserSetTenantResponse {
  accessToken: string
  refreshToken: string
  store: Store
}

export interface TotalUsersResponse {
  query: {
    'start-date': Date
    'end-date': Date
    ids: string
    dimensions: string
    metrics: string[]
    'start-index': number
    'max-results': number
  }
  totalResults: number
  columnHeaders: [
    {
      name: string
      columnType: string
      dataType: string
    }
  ]
  totalsForAllResults: {
    'ga:users': string
  }
  rows: any[]
}

export interface PwaInstallationsResponse {
  installations: PwaInstallation[]
}

export interface MostVisitedPagesResponse {
  query: {
    'start-date': Date
    'end-date': Date
    ids: string
    dimensions: string
    metrics: string[]
    'start-index': number
    'max-results': number
  }
  totalResults: number
  columnHeaders: [
    {
      name: string
      columnType: string
      dataType: string
    }
  ]
  totalsForAllResults: {
    'ga:pageviews': string
  }
  rows: any[]
}

export type NotificationVirtualDocksResponse = {
  items: number
}

export type StatusVirtualDocksResponse = {
  id: string
  cnpj: string
  enabled: boolean
  distributor: string
  status:string
  reason?: string[]
  createdAt: string
  updatedAt: string
}

export interface OrderStatisticsResponse {
  statistics: {
    totalOrder: number
    orderAccept: number
    orderReject: number
    orderPending: number
    valueSold: number
    totalCustomers: number
  }
}

export interface OrderResponse extends Pagination {
  Orders: Order[]
  order: Order
  historyOrders: HistoryOrderStatus[]
  salesHistory: Order[]
  saleHistory: Order
  status: OrderStatus[]
  deletedId?: string
}

export interface EventsResponse {
  query: {
    'start-date': Date
    'end-date': Date
    ids: string
    dimensions: string
    metrics: string[]
    'start-index': number
    'max-results': number
  }
  totalResults: number
  columnHeaders: [
    {
      name: string
      columnType: string
      dataType: string
    },
    {
      name: string
      columnType: string
      dataType: string
    }
  ]
  totalsForAllResults: {
    'ga:totalEvents': string
  }
  rows: any[]
}

export interface StoreResponse {
  store: Store
}

export interface FileResponse {
  files: File[]
}

export interface StoreSettingsResponse {
  settings: Store['settings']
}

export interface GetBannerResponse extends Pagination {
  banners: Banner[]
}

export interface PutBannerResponse {
  banner: Banner[]
}

export interface PostBannerResponse {
  banner: Banner
}

export interface DeleteBannerResponse {
  deletedId: Banner['_id'][]
}

export interface GetLayoutResponse {
  banners: Banner[]
  store: Store
}

export interface PostLayoutResponse {
  banners: any[]
}

export interface GetShowcases extends Pagination {
  showcase: Showcase[] | Showcase
}

export interface PostShowcase {
  showcase: Showcase
}

export interface Deleted {
  deletedId: string
}

export interface GetProducts extends Pagination {
  products: Product[]
  product: Product
  deletedId: Product['_id'] | Product['_id'][]
}

export interface GetVirtualProducts extends Pagination {
  virtualProducts: Product[]
  virtualProduct: Product
  deletedId: Product['_id'] | Product['_id'][]
}

export interface GetAdminNotifications extends Pagination {
  notification: Notification[]
}

export interface GetManufacturers extends Pagination {
  manufacturers: Manufacturer[]
}

export interface GetCategorys extends Pagination {
  categorys: Category[]
  category: Category
  deletedId?: string
}

export interface PutShowcase {
  showcase: Showcase
}

export interface AboutUsResponse {
  aboutUs: AboutUs[]
  deltedtId?: string
}

export interface DeliveryScheduleResponse {
  schedules: DeliverySchedule[]
  deletedId?: string
}

export interface StoreInfoResponse {
  store: Store
}

export interface StoreAddSettingsResponse {
  setting: Setting
}

export interface PaymentMethodsResponse {
  payments: PaymentMethods[]
  deletedId?: string
}
export interface PaymentOptionResponse {
  paymentOptions: PaymentOptions[]
  paymentOption: PaymentOptions
}

export interface GetImports {
  imports: Import[] | Import
}

export interface DeleteImports {
  deletedId: Import['_id'][]
}

export interface GetCustomers extends Pagination {
  customers: Customer[] | Customer
}

export interface DeleteCustomers {
  deletedId: Customer['_id']
}

export interface GetCustomerProductOrders {
  products: ProductOrder[]
}

export interface GetGanalytics {
  ganalytics: GAnalytics
}

export interface PutGanalytics {
  ganalytics: GAnalytics
}

export interface DeliveryScheduleResponse {
  schedules: DeliverySchedule[]
  deletedId?: string
}

export interface StoreDeliveryResponse {
  deliveryFees: DeliveryFee[]
  distanceDeliveryFees: DistanceDeliveryFee[]
  states: State[]
  cities: City[]
  neighborhoods: Neighborhood[]
  neighborhood: Neighborhood
  deletedId: string
}

export interface GetIntegrationSql {
  integrationSql: IntegrationSql[] | IntegrationSql
}

export interface GetErp {
  erp: Erp
}

export interface GetCupoms extends Pagination {
  cupoms: Cupom[]
}

export interface GetCupom {
  cupom: Cupom
}

export interface DeleteCupom {
  deletedId: Cupom['_id']
}

export interface PutCupom {
  cupom: Cupom
}
export interface PostCupom {
  cupom: Cupom
}

export interface GetStoreIntegration {
  storeIntegration: StoreIntegration
}

export interface PostStoreIntegration {
  storeIntegration: StoreIntegration
}

export interface ProductControlResponse {
  productControls: Control[]
  deletedId?: Control['_id']
}

export interface ProductClassification {
  classifications: Classification[]
}

export interface FileResponse {
  image: File
  deletedId: File['_id']
}

export interface ResponsePutPayment {
  paymentMethod: PaymentMethods
}

export interface StoreGroupResponse {
  groups: StoreGroup[]
  stores: Store[]
  storeUrls: StoreUrls[]
  deletedId: string
}

export interface BillboardResponse {
  billboard: IBillboard[]
}

export interface ReportReponse {
  report: string
}

export interface IFoodReportResponse {
  reports: IFoodReport[]
}

export interface IntegrationResponse {
  integration: Integration
}

export interface IFoodOrdersResponse {
  ifoodHistory: IFoodOrder[]
}

export interface IFoodOrderDetailResponse {
  ifoodOrder: IFoodDetail
}

export interface ImportHistoryResponse {
  importHistory: ImportHistory[]
  ok: boolean
}

export interface TrackingShippingResponse {
  tracking: Tracking[]
}

export interface RouteLinkResponse {
  links: RouteLink[]
}

export interface IMarketingAutomationResponse {
  automations: MarketingAutomations
}

export interface IIntegrationModuleResponse {
  module: IntegrationModule
}

export interface PaymentLinkResponse {
  link: string
  paymentLinks: PaymentLink[]
}

export interface DeletedPaymentLink {
  deletedId: PaymentLink['_id']
}

export interface EpharmaResponse {
  config_epharma_clientId: string
  config_epharma_username: string
  config_epharma_password: string
}

export interface InvoicesPendingResponse {
  idCobranca: number
  idCliente: number
  cpfCnpj: string
  nomeFantasia: string
  razaoSocial: string
  numeroTitulo: number
  numeroParcela: number
  dataEmissao: string
  dataVencimentoOriginal: string
  dataVencimento: string
  dataPagamento: string | null
  isQuitado: boolean
  competencia: string
  valor: number
  valorPago: number | null
  valorMoraMulta: number
  valorDesconto: number
  linhaDigitavel: string
  metodoPagamento: string
}

export interface CustomerResponse {
  idCliente: number
  idIntegracao: string
  isAtivo: boolean
  nomeFantasia: string
  cpfCnpj: string
  email: string
  meioPagamento: string
  diaVencimentoCobranca: number
}

export interface StoreBranchPickupResponse {
  storeBranch: StoreBranchPickup
  storeBranches: StoreBranchPickup[]
  deletedId: string
}

export interface PbmPreOrderResponse {
  preOrder: IPbmPreOrder | null
}

// PaymentMethods - Covenant
export interface GetCovenantMethod {
  covenantMethod: Partial<PaymentMethods>
}
export interface PutCovenantMethod {
  covenantMethod: Partial<PaymentMethods>
}
export interface DeletedCovenantMethod {
  deletedId: PaymentMethods['_id']
}

// PaymentMethods - Gateways
export interface GetGatewaysMethod {
  gateways: Partial<PaymentMethods>[]
}
export interface PutGatewayMethod {
  covenantMethod: Partial<PaymentMethods>
}
export interface DeletedGatewayMethod {
  deletedId: PaymentMethods['_id']
}

export interface GetNotification {
  _id: string,
  createdAt: string,
  title: string,
  message: string,
  faturAgil: {
    customerId: number,
    numberInvoice: number,
    dueDate: string
  },
  active: boolean,
  type: 'ATTENTION' | 'LOCKED' | 'EXPIRED' | 'EXPIRING' | 'WARNING',
  storeId: string
}