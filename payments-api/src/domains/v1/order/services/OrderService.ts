import {
  AddressRepository,
  Cart,
  CartRepository,
  CupomRepository,
  CustomerRepository,
  DeliveryFeeRepository,
  Order,
  OrderRepository,
  PagseguroOrder,
  PagseguroOrderRepository,
  PaymentMethodRepository,
  PicpayOrder,
  PicpayOrderRepository,
  Product,
  ProductRepository,
  StatusOrderRepository,
  StoneOrderRepository,
  StoneOrder,
  StoreRepository,
  Cupom,
} from '@mypharma/api-core'
import { ObjectId } from 'bson'
import * as moment from 'moment'
import SpecialPrice from '../../../../utils/special-product-price'
import ProductRequest from '../interfaces/IProductRequest'
const { DATABASE_MASTER_NAME } = process.env

export function CreateOrder(tenant: string, data: Partial<Order>) {
  return OrderRepository.repo<OrderRepository>(tenant).createDoc(data)
}

export function CreateStoneOrder(tenant: string, data: Partial<StoneOrder>) {
  return StoneOrderRepository.repo<StoneOrderRepository>(tenant).save(data)
}

export function CreatePagseguroOrder(tenant: string, data: Partial<PagseguroOrder>) {
  return PagseguroOrderRepository.repo<PagseguroOrderRepository>(tenant).save(data)
}

export function CreatePicpayOrder(tenant: string, data: Partial<PicpayOrder>) {
  return PicpayOrderRepository.repo<PicpayOrderRepository>(tenant).save(data)
}

export function GetOrderDetail(tenant: string, id: string) {
  return OrderRepository.repo<OrderRepository>(tenant).findById(id)
}

export function GetCustomerOrders(tenant: string, id: string) {
  return OrderRepository.repo<OrderRepository>(tenant).find({
    where: {
      'customer._id': new ObjectId(id),
    },
  })
}

export function GetPaymentMethod(tenant: string, id: string) {
  return PaymentMethodRepository.repo<PaymentMethodRepository>(tenant).findById(id)
}

export function GetCustomerAddress(tenant: string, _id: string = null) {
  if (_id) {
    return AddressRepository.repo<AddressRepository>(tenant).findById(_id.toString())
  }
}

export async function GetDelivery(tenant: string, neighborhood_id: string) {
  return DeliveryFeeRepository.repo<DeliveryFeeRepository>(tenant).findOne({
    where: {
      'neighborhood._id': new ObjectId(neighborhood_id),
    },
  })
}

export function GetStatusOrder() {
  return StatusOrderRepository.repo<StatusOrderRepository>(DATABASE_MASTER_NAME).find({})
}

export function GetCustomer(tenant: string, id: string) {
  return CustomerRepository.repo<CustomerRepository>(tenant).findById(id)
}

export async function UpdateOrder(tenant: string, order: Order) {
  const _id = new ObjectId(order._id.toString())

  await OrderRepository.repo(tenant).updateOne({ _id }, { $set: { ...order } })

  return OrderRepository.repo(tenant).findById(_id)
}

export function GetStore(id: string) {
  return StoreRepository.repo<StoreRepository>(DATABASE_MASTER_NAME).findById(id)
}

export function UpdateCartUser(tenant: string, customerId: string, cart: Partial<Cart>) {
  return CartRepository.repo<CartRepository>(tenant).findOneAndUpdate({ customerId }, { $set: cart })
}

export function GetCustomerCart(tenant: string, customerId: string) {
  return CartRepository.repo<CartRepository>(tenant).findOne({ customerId })
}

export async function ParseProduct(tenant: string, products: ProductRequest[]) {
  if (products.length <= 0) {
    throw new Error('products_array_invalid')
  }

  const allProducts = await ProductRepository.repo(tenant).find({
    where: {
      _id: { $in: products.map((p) => new ObjectId(p.product_id)) },
    },
  })

  if (allProducts.length <= 0) {
    throw new Error('products_not_found')
  }

  const normalized = allProducts.map((product) => {
    const { name, price, quantity, specials } = product
    const special = SpecialPrice(specials)

    return {
      product,
      name,
      unitaryValue: special ? special.price : price,
      promotionalPrice: special ? special.price : price,
      amount: quantity,
    }
  })

  return normalized as any as Order['products']
}

export async function ProcessProduct(products: ProductRequest[], parsedProducts: Order['products'], tenant: string, cupom: Cupom | null = null) {
  const processedProducts = []

  let total = 0
  let price = 0

  if (cupom) {

    const productsToCompare = []
    products.forEach((p) => {
      const product = parsedProducts.find((x) => x.product._id.toString() === p.product_id.toString())

      if (product) {
        const { unitaryValue, promotionalPrice } = product
        productsToCompare.push({
          product: product.product,
          unitaryValue,
          promotionalPrice,
          amount: p.quantity,
        })
      }
    })

    productsToCompare.forEach((p) => {
      const { unitaryValue, amount } = p
      total += Number(amount) * Number(unitaryValue)
    })
    const { type, allProducts, products: productsIds = [], descountCategorys: categoriesId = [], minimumPrice, descountPercentage } = cupom

    if (type.toLowerCase() === 'product') {
      productsToCompare.map((p) => {
        const { product, unitaryValue } = p
        const discount = (descountPercentage / 100) * unitaryValue

        if (productsIds.filter((x) => x.toString() === product._id.toString()).length > 0 && !allProducts) {
          if (minimumPrice > 0) price = total >= minimumPrice ? unitaryValue - discount : unitaryValue
          else price = unitaryValue - discount

          processedProducts.push({
            ...p,
            unitaryValue: price,
            promotionalPrice: price,
          })
        } else if (allProducts) {
          if (minimumPrice > 0) price = total >= minimumPrice ? unitaryValue - discount : unitaryValue
          else price = unitaryValue - discount

          processedProducts.push({
            ...p,
            unitaryValue: price,
            promotionalPrice: price,
          })
        } else {
          processedProducts.push({
            ...p,
            unitaryValue: unitaryValue,
            promotionalPrice: unitaryValue,
          })
        }
      })
    }

    if (type.toLowerCase() === 'category') {
      productsToCompare.map((p) => {
        const { product, unitaryValue } = p
        const discount = (descountPercentage / 100) * unitaryValue

        if (product.category.filter((c) => categoriesId.filter((x) => x.toString() === c._id.toString()).length > 0).length > 0) {
          if (minimumPrice > 0) price = total >= minimumPrice ? unitaryValue - discount : unitaryValue
          else price = unitaryValue - discount

          processedProducts.push({
            ...p,
            unitaryValue: price,
            promotionalPrice: price,
          })
        } else {
          processedProducts.push(p)
        }
      })
    }
    return processedProducts as Order['products']
  }

  for (const p of products) {
    const product = parsedProducts.find((x) => x.product._id.toString() === p.product_id.toString())

    if (product) {
      const { unitaryValue, promotionalPrice } = product
      processedProducts.push({
        product: product.product,
        unitaryValue,
        promotionalPrice,
        amount: p.quantity,
      })
    }
  }
  return processedProducts as Order['products']
}


export async function getAvailableCupom(tenant: string, code: string | null = null) {

  if (!code) return null
  const today = moment()

  const cupom = await CupomRepository.repo(tenant).findOne({
    where: {
      code,
      status: true
    }
  })

  if (today.isBetween(cupom.initialDate, cupom.finalDate)) {

    return cupom
  }

  return null
}

export function countOrderBuyWithCupom(tenant: string, code: string, customerId: string) {

  return OrderRepository.repo(tenant).count({
    'cupom.code': code,
    $or: [
      { 'customer._id': customerId },
      { 'customer._id': new ObjectId(customerId) }
    ]
  })
}