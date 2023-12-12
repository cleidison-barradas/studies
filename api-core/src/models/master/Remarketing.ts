import { Column } from 'typeorm'
import { Customer } from '../store/Customer'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { ObjectId } from 'bson'
import { GenericObject } from '../..'

interface ProductsRemarketing {
  name: string
  price: string
  quantity: number
  image: string
}

interface StoreRemarketing {
  storeId: ObjectId
  name: string
  color: string
  phone: string
  checkout: string
  whatsapp: string
  storeEmail: string
  unsubscribe: string
}

export type RemarketingChannel = 'EMAIL' | 'SMS'
export type RemarketingStatus = 'SENDING' | 'PENDING' | 'SENT'
export type RemarketingType = 'RECENT-CART' | 'MISS-YOU' | 'NOTIFICATION'

@Entity({ name: 'remarketing' }, ConnectionType.Master)
export class Remarketing extends BaseModel {

  @Column({
    type: 'string'
    })
  channel: RemarketingChannel

  @Column({
    type: 'array'
    })
  products: ProductsRemarketing[]

  @Column()
  customer: Customer

  @Column({
    type: 'json'
    })
  store: StoreRemarketing

  @Column({
    type: 'string',
    })
  status: RemarketingStatus

  @Column({
    type: 'timestamp'
    })
  sendAt: Date

  @Column({
    type: 'number'
    })
  interval: number

  @Column({
    type: 'string',
    })
  type: RemarketingType

  @Column({
    type: 'json'
    })
  dynamicContent: GenericObject
}
