import { ObjectId } from 'bson'
import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Product } from '../store/Product'

export enum NotificationType {
  LOCKED = 'LOCKED',
  EXPIRED = 'EXPIRED',
  EXPIRING = 'EXPIRING',
  WARNING = 'WARNING',
  ATTENTION = 'ATTENTION',
  DOCAS_PRODUCT_NOT_INTEGRATED = 'DOCAS_PRODUCT_NOT_INTEGRATED',
  DOCAS_INTEGRATED_BUT_NOT_CUSTOMIZED_PRODUCT = 'DOCAS_INTEGRATED_BUT_NOT_CUSTOMIZED_PRODUCT'
}

export type FaturAgilType = {
  customerId: number
  numberInvoice: number
  dueDate: Date
}


@Entity({ name: 'notification' }, ConnectionType.Store)
export class Notification extends BaseModel {
  @Column({
    type: 'text'
    })
  title: string

  @Column({
    type: 'text'
    })
  message: string

  @Column({
    type: 'json'
    })
  faturAgil?: FaturAgilType

  @Column({
    type: 'json'
    })
  products?: Product[]

  @Column({
    type: 'boolean'
    })
  active: boolean

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.ATTENTION
    })
  type: NotificationType

  @Column()
  storeId: ObjectId
}