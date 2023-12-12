import React, { createContext } from 'react'
import { BaseApi, ApiShipping } from '../../config'
import Order from '../../interfaces/order'
import {
  getOrders,
  getOrderStatistics,
  getHistoryStatusOrder,
  getSalesHistory,
  getSaleDetail,
  alterOrder,
  getStatusOrder,
  deleteOrder,
  getIFoodOrders,
  getIFoodOrderDetail,
  deleteIFoodOrder,
  getTrackingShipping,
  putOrderDispatch,
  putOrderFiscalDocument,
  getPbmPreOrder
} from '../../services/api'
import OrderStatistics from '../../interfaces/orderStatistic'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import { loadStorage } from '../../services/storage'
import stringToDate from '../../helpers/string-to-date'
import Pagination from '../../interfaces/pagination'
import HistoryOrderStatus from '../../interfaces/historyOrderStatus'
import OrderStatus from '../../interfaces/orderStatus'
import { IFoodOrder, IFoodDetail } from '../../interfaces/ifood'
import Tracking from '../../interfaces/tracking'
import { RequestIFoodOrders, RequestPutOrderDispatch, RequestPutOrderFiscalDocument } from '../../services/api/interfaces/ApiRequest'
import { IStorageTenant } from '../../interfaces/storageTenant'
import { IUser } from '../../interfaces/user'
import Store from '../../interfaces/store'
import { ISender } from '../../interfaces/sender'
import { IPbmPreOrder } from '../../interfaces/pbm'

export const TENANT_KEY = '@myp-admin/tenant'
export const USER_KEY = '@myp-admin/user'

interface OrderContextState extends BaseContextState {
  orders: Order[]
  order: Order | null
  statistics: OrderStatistics | null
  historyOrders: HistoryOrderStatus[]
  salesHistory: Order[]
  saleHistory: Order | null
  ifoodHistory: IFoodOrder[]
  ifoodOrder: IFoodDetail | null
  status: OrderStatus[]
  store: Store | null,
  tracking: Tracking[]
  preOrder: IPbmPreOrder | null
}

interface OrderContextData extends OrderContextState {
  getStatistics: (...args: any) => void
  getOrders: (...args: any) => void
  requestGetStatusHistory: (...args: any) => void
  requestGetSalesHistory: (...args: any) => void
  requestGetOrderDetail: (...args: any) => void
  requestAlterOrder: (...args: any) => void
  requestGetStatusOrder: (...args: any) => void
  requestDeleteOrder: (...args: any) => void
  requestIFoodOrder: (...args: any) => void
  requestIFoodOrderDetail: (...args: any) => void
  requestDeleteIFoodOrder: (...args: any) => void
  requestGetTrackingOrder: (...args: any) => void
  requestPutOrderDispatch: (...args: any) => void
  requestPutOrderFiscalDocument: (...args: any) => void
  requestPbmPreOrder: (...args: any) => void
}

const orderContext = createContext({} as OrderContextData)
export default orderContext

const { Consumer, Provider } = orderContext
export const OrderConsumer = Consumer

export class OrderProvider extends BaseContextProvider {
  state: OrderContextState = {
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    orders: [],
    statistics: null,
    order: null,
    saleHistory: null,
    ifoodOrder: null,
    historyOrders: [],
    salesHistory: [],
    status: [],
    ifoodHistory: [],
    store: null,
    tracking: [],
    preOrder: null
  }

  componentDidMount() {
    const tenant = loadStorage<IStorageTenant>(TENANT_KEY)
    const user = loadStorage<IUser>(USER_KEY)

    if (tenant && user && user.store.length > 0) {
      const stores = user.store
      const store = stores.find(x => x._id?.includes(tenant._id))

      this.setState(state => ({
        ...state,
        store
      }))
    }
  }

  requestPutOrderFiscalDocument = async ({ orderId, fiscalDocument }: RequestPutOrderFiscalDocument) => {
    const response = await putOrderFiscalDocument({ orderId, fiscalDocument })

    if (response.ok) {

      this.processResponse(response, ['saleHistory'])

      this.showMessage('Nota fiscal integrada com sucesso', 'success')
    } else {
      this.showMessage('Erro ao realizar integração', 'error')
    }
  }

  requestPutOrderDispatch = async ({ orderId, orderDispatch }: RequestPutOrderDispatch) => {
    const response = await putOrderDispatch({ orderId, orderDispatch })

    if (response.ok) {
      this.processResponse(response, ['saleHistory'])

      this.showMessage('Despacho integrado com sucesso', 'success')

    } else {
      this.showMessage('Erro ao realizar integração', 'error')
    }
  }

  getStatistics = async (initialDate: Date = stringToDate('30daysAgo'), finalDate: Date = new Date()) => {
    this.startRequest(BaseApi)
    const response = await getOrderStatistics({ initialDate, finalDate })
    this.processResponse(response, ['statistics'])
    return response
  }

  getOrders = async (pagination?: Pagination) => {
    this.startRequest(BaseApi)
    const response = await getOrders(pagination)
    this.processResponse(response, ['orders'])
    return response
  }

  requestGetStatusHistory = async (data: any) => {
    this.startRequest(BaseApi)

    const response = await getHistoryStatusOrder(data)
    this.processResponse(response, ['historyOrders'])
  }

  requestGetSalesHistory = async (data: any) => {
    this.startRequest(BaseApi)

    const response = await getSalesHistory(data)
    this.processResponse(response, ['salesHistory'])
  }
  requestGetOrderDetail = async (id: any) => {
    this.startRequest(BaseApi)

    const response = await getSaleDetail(id)
    this.processResponse(response, ['saleHistory'])

  }
  requestAlterOrder = async (id: any, data: any) => {
    this.startRequest(BaseApi)

    const response = await alterOrder(id, data)
    this.processResponse(response, ['order'])
  }
  requestGetStatusOrder = async () => {
    this.startRequest(BaseApi)

    const response = await getStatusOrder()
    this.processResponse(response, ['status'])
  }
  requestDeleteOrder = async (data: any) => {
    this.startRequest(BaseApi)

    const response = await deleteOrder(data)
    this.processResponse(response, ['deletedId'])
  }

  requestIFoodOrder = async (
    data: RequestIFoodOrders
  ) => {
    this.startRequest(BaseApi)
    const response = await getIFoodOrders(data)
    this.processResponse(response, ['ifoodHistory'])
  }

  requestIFoodOrderDetail = async (cod: string) => {
    this.startRequest(BaseApi)
    const response = await getIFoodOrderDetail(cod)
    this.processResponse(response, ['ifoodOrder'])
  }

  requestDeleteIFoodOrder = async (id: string) => {
    this.startRequest(BaseApi)
    const response = await deleteIFoodOrder(id)
    this.processResponse(response, [])
    if (response.ok) {
      this.showMessage('Pedido finalizado com sucesso', 'success')
    }
  }

  requestGetTrackingOrder = async (sender: ISender, trackingCode: string) => {
    this.startRequest(ApiShipping)
    const response = await getTrackingShipping(sender, trackingCode)
    this.processResponse(response, ['tracking'])
  }

  requestPbmPreOrder = async (orderId: string) => {
    this.startRequest(BaseApi)
    const response = await getPbmPreOrder(orderId)

    this.processResponse(response, ['preOrder'])
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          getStatistics: this.getStatistics,
          getOrders: this.getOrders,
          requestGetStatusHistory: this.requestGetStatusHistory,
          requestGetSalesHistory: this.requestGetSalesHistory,
          requestAlterOrder: this.requestAlterOrder,
          requestGetStatusOrder: this.requestGetStatusOrder,
          requestDeleteOrder: this.requestDeleteOrder,
          requestGetOrderDetail: this.requestGetOrderDetail,
          requestIFoodOrder: this.requestIFoodOrder,
          requestIFoodOrderDetail: this.requestIFoodOrderDetail,
          requestDeleteIFoodOrder: this.requestDeleteIFoodOrder,
          requestGetTrackingOrder: this.requestGetTrackingOrder,
          requestPutOrderDispatch: this.requestPutOrderDispatch,
          requestPutOrderFiscalDocument: this.requestPutOrderFiscalDocument,
          requestPbmPreOrder: this.requestPbmPreOrder
        }}
      >
        {children}
      </Provider>
    )
  }
}
