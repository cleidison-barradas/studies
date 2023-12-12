import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Order } from './Order'

@Entity({ name: 'picpayOrder' }, ConnectionType.Store)
export class PicpayOrder extends BaseModel {
  @Column()
  order: Order

  @Column({
    type: 'string'
    })
  authorizationId: string

  @Column({
    type: 'string',
    default: 'created'
    })
  status: string
}
