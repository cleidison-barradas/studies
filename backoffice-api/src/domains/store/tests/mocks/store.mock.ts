import StoreInterfaceMock from './StoreInterfaceMock'

const storesMock: Array<StoreInterfaceMock> = [
  {
    'storeName': 'Farmácia Alpha',
    'tenant': 'alpha',
    'createdAt': new Date('2022-12-06T03:00:00.000Z'),
    'orders':  10
  },
  {
    'storeName': 'Farmácia Ômega',
    'tenant': 'omega',
    'createdAt': new Date('2022-10-06T03:00:00.000Z'),
    'orders': 5
  },
  {
    'storeName': 'Farmácia Beta',
    'tenant': 'beta',
    'createdAt': new Date('2022-12-19T03:00:00.000Z'),
    'orders': 6
  },
]

export default storesMock
