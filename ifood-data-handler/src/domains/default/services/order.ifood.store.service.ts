import { IFoodOrderRepository, Order, OrderRepository } from "@mypharma/api-core";

export function getIfoodOrders(tenant: string, ifoodCodes: string[]) {
  return IFoodOrderRepository.repo(tenant).find({
    where: {
      ifoodCode: { $in: ifoodCodes }
    }
  })
}

export function getIfoodOrder(tenant: string, ifoodCode: string) {
  return IFoodOrderRepository.repo(tenant).findOne({
    where: {
      ifoodCode
    }
  })
}

export function createStoreOrder(tenant: string, order: Partial<Order>) {
  return OrderRepository.repo(tenant).createDoc(order)
}