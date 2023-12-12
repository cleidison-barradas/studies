import { IFoodOrderRepository, OrderRepository } from "@mypharma/api-core";

export function getStoreOrder(tenant: string, originalId: number) {
  return OrderRepository.repo(tenant).count({ originalId })
}

export function bulkIfoodOrders(tenant: string, data: any[]) {
  return IFoodOrderRepository.repo(tenant).bulkWrite(data)
}

export function bulkStoreOrders(tenant: string, data: any[]) {
  return OrderRepository.repo(tenant).bulkWrite(data)
}