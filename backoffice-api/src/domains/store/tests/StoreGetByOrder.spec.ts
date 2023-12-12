import storesMock from './mocks/store.mock'
import StoreInterfaceMock from './mocks/StoreInterfaceMock'

//Essa função foi adaptada para ser testada, uma vez que a função original abrane conexão ao banco de dados
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getStoreByOrderAdapted(stores:StoreInterfaceMock[], orderLimit: number ): any {
  const storesByOrders = []

  if (stores.length > 0) {
    for (const store of stores) {
      if (store.orders < orderLimit) {
        storesByOrders.push({
          storeName: store.storeName,
          tenant: store.tenant,
          orders: store.orders,
          createdAt: store.createdAt
        })
      }
    }
  }

  storesByOrders.sort((a, b) => {
    return a.orders < b.orders ? 1 : -1
  })

  return storesByOrders
}

describe('Test get store by orders and ordenate them', () => {
  const correctStores = [
    {
      'storeName': 'Farmácia Beta',
      'tenant': 'beta',
      'createdAt': new Date('2022-12-19T03:00:00.000Z'),
      'orders': 6
    },
    {
      'storeName': 'Farmácia Ômega',
      'tenant': 'omega',
      'createdAt': new Date('2022-10-06T03:00:00.000Z'),
      'orders': 5
    }
  ]
  const orderLimit = 7

  const expectedStores = getStoreByOrderAdapted(storesMock, orderLimit)
  test('quantity of stores who has less orders then orderLimit',() => {
    expect(expectedStores.length).toBe(correctStores.length)
  })
  test('Stores who has less orders then orderLimit and ordenate them descendingly', () => {
    expect(expectedStores).toStrictEqual(correctStores)
  })
})
