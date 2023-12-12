import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'customer_bi' }, ConnectionType.Store)
export class CustomerBI extends BaseModel {
  @Column({
    type: 'number',
    default: 0
    })
  totalValue: number

  @Column({
    type: 'number',
    default: 0
    })
  orderTimes: number

  @Column({
    type: 'string',
    })
  customer_id: string
}
