import { OrderRepository, ORM, Store } from '@mypharma/api-core'

export async function getStoreByOrder(stores: Store[], orderLimit?: number): Promise<Map<string, number>> {
  const tenants = stores.map(store => store.tenant)

  const storeOrderNumbers = new Map<string, number>([])

  if(orderLimit) {
    for await (const tenant of tenants) {
      await ORM.setup(null, tenant)

      const quantityOrders = await OrderRepository.repo(tenant).count({})

      if (quantityOrders < orderLimit && !storeOrderNumbers.has(tenant)) {
        storeOrderNumbers.set(tenant, quantityOrders)
      }
    }

  } else {
    for await (const tenant of tenants) {
      await ORM.setup(null, tenant)

      const quantityOrders = await OrderRepository.repo(tenant).count({})

      if (!storeOrderNumbers.has(tenant)) {
        storeOrderNumbers.set(tenant, quantityOrders)
      }
    }
  }

  return storeOrderNumbers
}
