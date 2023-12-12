import { AxiosRequestHeaders } from 'axios'
import IfoodPlugin from '../../../support/plugins/ifood'

export function auth(client_id: string, client_secret: string) {
  return IfoodPlugin.auth(client_id, client_secret)
}

export function setHeader(headers: AxiosRequestHeaders) {
  return IfoodPlugin.setAuthToken(headers)
}

export function getOrders(storeId: number) {
  return IfoodPlugin.getOrders(storeId)
}

export function getOrderDetail(codigoDoPedido: string) {
  return IfoodPlugin.getOrderDetail(codigoDoPedido)
}

export function verifyOrder(id: number) {
  return IfoodPlugin.verifyOrder(id)
}