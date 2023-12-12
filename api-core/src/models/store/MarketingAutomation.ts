import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

export interface IMissYouType {
  active: boolean
  interval: number
}

@Entity({ name: 'marketingautomation' }, ConnectionType.Store)
export class MarketingAutomation extends BaseModel {
  @Column({
    type: 'boolean'
    })
  status: boolean

  @Column({
    type: 'array'
    })
  MISS_YOU: IMissYouType[]

  @Column({
    type: 'boolean'
    })
  RECENT_CART: boolean
}
