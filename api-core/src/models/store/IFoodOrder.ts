import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({name: 'ifoodOrder'}, ConnectionType.Store)
export class IFoodOrder extends BaseModel {
  @Column({
    type: 'number'
    })
  ifoodId: number

  @Column({
    type: 'string'
    })
  ifoodCode: string

  @Column({
    type: 'number'
    })
  price: number

  @Column({
    type: 'string'
    })
  status: string

  @Column({
    type: 'string'
    })
  partnerCode: string
}