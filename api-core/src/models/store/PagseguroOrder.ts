import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Order } from './Order'

@Entity({ name: 'pagseguroOrder' }, ConnectionType.Store)
export class PagseguroOrder extends BaseModel {
  @Column(() => Order)
  order: Order

  @Column({
    type: 'string'
    })
  pagseguroId: string

  @Column({
    type: 'number'
    })
  status: number
}
