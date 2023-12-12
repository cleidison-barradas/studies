import { Column } from 'typeorm'
import { Order } from '../..'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'orderShipping' }, ConnectionType.Store)
export class OrderShipping extends BaseModel {

  @Column({
    type: 'string'
    })
  invoice_reference: string

  @Column()
  order: Order

  @Column({
    type: 'string'
    })
  protocol: string

  @Column({
    type: 'string'
    })
  service_id: string

  @Column({
    type: 'string'
    })
  agency_id: string
}