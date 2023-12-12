import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { GenericObject } from '../../interfaces/generics/GenericObject'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'plan' }, ConnectionType.Master)
export class StorePlan extends BaseModel {
  @Column({
    type: 'string'
    })
  name: string

  @Column({
    type: 'string'
    })
  description: string

  @Column({
    type: 'number'
    })
  price: number

  @Column({
    type: 'enum',
    enum: ['start', 'pro', 'pro-branch'],
    default: 'start'
    })
  rule: string

  @Column({ type: 'json'})
  permissions: GenericObject
}
