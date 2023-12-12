import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
// import { GenericObject } from '../../interfaces/generics/GenericObject'

@Entity({ name: 'paymentoptions' }, ConnectionType.Store)
export class PaymentOption extends BaseModel {
  @Column({
    type: 'string'
    })
  name: string

  @Column({
    type: 'text',
    enum: ['DEBIT', 'CREDIT', 'COVENANT', 'MONEY', 'ONLINE', 'GATEWAY', 'EXTERNAL'],
    })
  type: string
}
