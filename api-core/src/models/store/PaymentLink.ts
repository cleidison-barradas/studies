import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'paymentLink' }, ConnectionType.Store)
export class PaymentLink extends BaseModel {
  @Column({
    type: 'uuid',
    unique: true,
    })
  fingerprint: string

  @Column({
    type: 'uuid',
    })
  cartId: string

  @Column({
    type: 'text',
    })
  link: string

  @Column({
    type: 'number',
    })
  total: number

  @Column({
    type: 'number',
    })
  deliveryFee: number

  @Column({
    type: 'datetime',
    default: () => new Date()
    })
  createdAt: Date

  @Column({
    type: 'datetime',
    default: () => new Date()
    })
  updatedAt: Date
}
