import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Product } from './Product'
import { DeliveryFee } from './DeliveryFee'
import { DistanceDeliveryFee } from './DistanceDeliveryFee'
import { StatusOrder } from './StatusOrder'
import { Customer } from './Customer'
import { PaymentMethod } from './PaymentMethod'
import { GenericObject } from '../../interfaces/generics/GenericObject'
import { Cupom } from './Cupom'
import { StoreBranchPickup } from './StoreBranchPickup'
import { ObjectID } from '../../helpers/ObjectID'
import { IOriginPathType } from '../master/Cart'

export type IPrefix = 'iFood' | 'ecommerce' | 'Pluggto' | 'Docas'
export type IStock = 'virtual' | 'physical'
export type IPaymentCode = 'pay_online' | 'pay_on_delivery'
export type ISender = 'bestshipping' | 'courier' | 'not_selected'
export type IDeliveryMode = 'store_pickup' | 'own_delivery' | 'delivery_company'

export interface NfeData {
  nfe_link?: string;
  nfe_key?: string;
  nfe_number?: string;
  nfe_serie?: string;
  nfe_date?: Date;
}

export interface OrderProducts {
  amount: number;
  product: Product;
  unitaryValue: number;
  origin?: IOriginPathType
  promotionalPrice: number;
}

export interface OrderTotal {
  code: string;
  title: string;
  value: number;
}

export interface ShippingData {
  //put all the data from shipping here in the future. centralizing all of them
  shippingCompany?: string;
  shippingMethod?: string;
  trackCode?: string;
  trackUrl?: string;
  shippingDate?: Date;
  external_shipping_id?: string;
}

interface ExternalMarketplace {
  name?: string;
  externalId?: string;
}

@Entity({ name: 'order' }, ConnectionType.Store)
export class Order extends BaseModel {
  @Column({
    type: 'string',
    })
  prefix: IPrefix

  @Column({
    type: 'string',
    })
  stock?: IStock

  @Column()
  relatedOrderId: ObjectID

  @Column({
    type: 'string',
    })
  sequence: string

  @Column({
    type: 'string',
    })
  tagCode: string

  @Column()
  externalMarketplace?: ExternalMarketplace

  @Column({
    type: 'string',
    })
  sender: ISender

  @Column({
    type: 'string',
    })
  comment: string

  @Column({
    type: 'string',
    })
  clientIP: string

  @Column({
    type: 'string',
    })
  userAgent: string

  @Column({
    type: 'number',
    })
  moneyChange: number

  @Column({
    type: 'string',
    })
  cpf: string

  @Column({
    type: 'string',
    })
  paymentCode: IPaymentCode

  @Column({
    type: 'string',
    })
  paymentCustomField: string

  @Column({
    type: 'array',
    })
  products: OrderProducts[]
  @Column({
    type: 'number',
    })
  totalOrder: number

  @Column({
    type: 'array',
    })
  orderTotals: OrderTotal[]

  @Column({
    type: 'string',
    })
  healthInsurance: string

  @Column()
  deliveryData: DeliveryFee | DistanceDeliveryFee

  @Column()
  statusOrder: StatusOrder

  @Column()
  customer: Customer

  @Column()
  paymentMethod: PaymentMethod

  @Column({ type: 'array', default: [] })
  extras: GenericObject[]

  @Column({
    type: 'string',
    })
  deliveryMode: IDeliveryMode

  @Column({ type: 'json' })
  shippingOrder: GenericObject

  @Column({
    type: 'string',
    })
  trackingCode: string

  @Column({
    type: 'boolean',
    default: false,
    })
  installedApp: boolean

  @Column()
  cupom: Cupom

  @Column()
  nfe_data?: NfeData

  @Column()
  shippingData?: ShippingData

  @Column()
  branchPickup?: StoreBranchPickup
}
