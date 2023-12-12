import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { GenericObject } from '../../interfaces/generics/GenericObject'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'module' }, ConnectionType.Master)
export class Module extends BaseModel {
  @Column({
    type: 'string'
    })
  name: string

  @Column({
    type: 'string'
    })
  code: string

  @Column({
    type: 'string'
    })
  description: string

  @Column({
    type: 'boolean'
    })
  status: boolean

  @Column({
    type: 'string'
    })
  type: string

  @Column({
    type: 'string'
    })
  imageUrl: string

  @Column({
    type: 'json'
    })
  extras: GenericObject
}
