import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { ObjectId } from 'bson'

export type ITargetType = 'customers' | 'orders'

export type IProcessType = 'pending' | 'sending' | 'failure' | 'sent'

@Entity({ name: 'notificationcustomer' }, ConnectionType.Master)
export class NotificationCustomer extends BaseModel {

  @Column({
    type: 'string',
    enum: ['customers', 'orders'],
    })
  target: ITargetType

  @Column({
    type: 'string',
    enum: ['pending', 'sending', 'failure', 'sent'],
    })
  process: IProcessType

  @Column({
    type: 'datetime'
    })
  sentAt: Date

  @Column()
  storeId: ObjectId

  @Column({
    type: 'string'
    })
  message: string

  @Column({
    type: 'string'
    })
  subject: string
}
