import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Order } from './Order'

@Entity({ name: 'stoneOrder' }, ConnectionType.Store)
export class StoneOrder extends BaseModel {
  @Column(() => Order)
  order: Order

  @Column({
    type: 'string'
    })
  charge_id: string
}