import { Cart, CartRepository, Customer, CustomerRepository, Product, ProductRepository, RedisPlugin, Store, StoreRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

export function GetCart(tenant: string, fingerprint: string, customerId: string = null) {
  let where = {}

  customerId
    ? (where['$or'] = [{ customerId }, { fingerprint }])
    : (where = {
      fingerprint,
    })

  return CartRepository.repo<CartRepository>(tenant).findOne({
    where,
  })
}

export function GetCustomerCart(tenant: string, customerId: string) {
  return CartRepository.repo<CartRepository>(tenant).findOne({ customerId })
}

export function DeleteOldCart(tenant: string, fingerprint: string) {
  return CartRepository.repo<CartRepository>(tenant).deleteOne({ fingerprint })
}

export function SaveCart(tenant: string, cart: Cart) {
  return CartRepository.repo<CartRepository>(tenant).save(cart)
}

export function UpdateCart(tenant: string, cart: Partial<Cart>) {
  const { _id, ...$set } = cart
  return CartRepository.repo<CartRepository>(tenant).findOneAndUpdate({ _id: new ObjectId(_id as any) }, { $set })
}

export async function GetProductByEAN(EAN: Product['EAN'], tenant: string) {
  return ProductRepository.repo(tenant).findOne({ EAN })
}

export async function LoadStoreByID(storeId: string) {
  const _id = new ObjectId(storeId)

  const cached = await RedisPlugin.get(`store:${_id}`) as Store

  if (cached) {

    return cached
  }

  const store = await StoreRepository.repo(process.env.DATABASE_MASTER_NAME).findById(_id)

  await RedisPlugin.set(`store:${_id}`, store)

  return store
}

export async function LoadStoreByUrl(url: Store['url']) {
  return StoreRepository.repo(process.env.DATABASE_MASTER_NAME).findOne({ url })
}

export async function LoadCustomerByID(_id: Customer['_id'], tenant: string) {
  return CustomerRepository.repo(tenant).findOne({ _id })
}
