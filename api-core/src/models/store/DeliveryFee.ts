import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Neighborhood } from './Neighborhood'

@Entity({ name: 'deliveryFee' }, ConnectionType.Store)
export class DeliveryFee extends BaseModel {
  @Column({
    type: 'number',
    })
  deliveryTime: number

  @Column({
    type: 'number',
    default: 0.0
    })
  feePrice: number

  @Column({
    type: 'number',
    default: 0.0
    })
  freeFrom: number

  @Column({
    type: 'number',
    default: 0.0
    })
  minimumPurchase: number

  @Column()
  neighborhood: Neighborhood
}
