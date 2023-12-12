import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Order } from './Order'
import { StatusOrder } from './StatusOrder'

@Entity({ name: 'historyOrder' }, ConnectionType.Store)
export class HistoryOrder extends BaseModel {
  @Column()
  order: Order

  @Column()
  status: StatusOrder

  @Column({
    type: 'boolean',
    default: false
    })
  notify: boolean

  @Column({
    type: 'string'
    })
  comments: string
}
