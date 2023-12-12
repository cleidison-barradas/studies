import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { GenericObject } from '../../interfaces/generics/GenericObject'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { ObjectId } from 'bson'

@Entity({ name: 'integrationusererp' }, ConnectionType.Master)
export class IntegrationUserErp extends BaseModel {
  @Column({
    type: 'text',
    unique: true
    })
  userName: string

  @Column({
    type: 'text'
    })
  password: string

  @Column({
    type: 'text',
    unique: true
    })
  email: string

  @Column({
    type: 'text'
    })
  token: string

  @Column({
    type: 'boolean',
    default: false
    })
  admin: boolean

  @Column({
    type: 'array',
    default: []
    })
  store: GenericObject[]

  @Column({
    type: 'array'
    })
  erpId: ObjectId[]

  @Column({
    type: 'text'
    })
  erpUser: string

  @Column({
    type: 'text'
    })
  baseUrl?: string

  @Column({
    type: 'text'
    })
  lastSeen: Date
}
