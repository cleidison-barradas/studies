import {
  Cart,
  CartRepository,
  Customer,
  CustomerRepository,
  Product,
  RemarketingRepository,
  Store,
} from '@mypharma/api-core'
import { IPurchased } from '../interfaces/cart.request'
import { ObjectId } from 'bson'

export function GetCart(tenant: string, fingerprint: string, customerId: string = null) {
  // let where = {}

  // customerId
  //   ? (where['$or'] = [{ customerId }, { fingerprint }])
  //   : (where = {
  //     fingerprint,
  //   })

  // return CartRepository.repo<CartRepository>(tenant).findOne({
  //   where,
  // })
}

export function GetCustomerCart(tenant: string, customerId: string) {
  // return CartRepository.repo<CartRepository>(tenant).findOne({ customerId })
}

export function DeleteOldCart(tenant: string, fingerprint: string) {
  // return CartRepository.repo<CartRepository>(tenant).deleteOne({ fingerprint })
}

export function DeleteOldCartByID(tenant: string, id: string) {
  // return CartRepository.repo<CartRepository>(tenant).deleteOne({
  //   _id: new ObjectId(id),
  // })
}

export function PutCart(tenant: string, cart: Cart) {
  // return CartRepository.repo<CartRepository>(tenant).save({ ...cart, createdAt: new Date() })
}

export function UpdateCart(tenant: string, id: string, cart: Partial<Cart>) {
  // return CartRepository.repo<CartRepository>(tenant).findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...cart, updatedAt: new Date() } })
}

export function GetCupom(tenant: string, code: string) {
  // return CupomRepository.repo<CupomRepository>(tenant).findOne({ code, status: true })
}

export async function GetCupomActive(tenant: string, code: string, customerId: string) {
  // const cupom = await CupomRepository.repo<CupomRepository>(tenant).findOne({ code, status: true })

  // if (!cupom) return null

  // if (cupom.amount === 0) return cupom

  // const countPurchased = await countOrderBuyWithCupom(tenant, code, customerId)

  // if (countPurchased < cupom.amount) return cupom

  return null
}

export async function GetProductByEAN(EAN: Product['EAN'], tenant: string) {
  // return ProductRepository.repo(tenant).findOne({ EAN })
}

export async function LoadStoreByID(_id: Store['_id']) {
  // return StoreRepository.repo(process.env.DATABASE_MASTER_NAME).findOne({ _id })
}

export async function LoadStoreByUrl(url: Store['url']) {
  // return StoreRepository.repo(process.env.DATABASE_MASTER_NAME).findOne({ url })
}

export async function LoadCustomerByID(_id: Customer['_id'], tenant: string) {
  // return CustomerRepository.repo(tenant).findOne({ _id })
}

export async function CreateGlobalCart(products = [], purchased: IPurchased = 'NO', store: string, email: string, tenant: string) {

  const cart = await CartRepository.repo().findOne({
    where: {
      'customer.email': email,
      store: new ObjectId(store),
    },
  })

  if (!cart) {
    const customer = await CustomerRepository.repo(tenant).findOne({ email })

    if (!customer) {
      throw Error('customer_not_found')
    }

    return CartRepository.repo().createDoc({
      storeId: store,
      products,
      purchased,
      customerId: null,
      createdAt: new Date()
    })
  }

  await RemarketingRepository.repo().updateMany(
    { 'customer.email': email, 'store.storeId': new ObjectId(store) },
    { $set: { interval: 0 } }
  )

  return CartRepository.repo().updateOne(
    { 'customer.email': email, store: new ObjectId(store) },
    { $set: { products, purchased, updatedAt: new Date() } }
  )
}
