import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { GenericObject } from '../../interfaces/generics/GenericObject'

@Entity({ name: 'integrationlogs' }, ConnectionType.Integration)
export class IntegrationLog extends BaseModel {

  @Column({
    type: 'string'
    })
  storeName: string

  @Column({
    type: 'string'
    })
  storeUrl: string

  @Column({
    type: 'string'
    })
  erpName: string

  @Column({
    type: 'number'
    })
  received: number

  @Column({
    type: 'string'
    })
  tenant: string

  @Column({
    type: 'string'
    })
  status: string

  @Column({
    type: 'datetime'
    })
  lastSeen: Date

  @Column({
    type: 'json'
    })
  extras: GenericObject
}
