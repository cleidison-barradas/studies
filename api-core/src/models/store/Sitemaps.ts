import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'sitemaps' }, ConnectionType.Store)
export class Sitemaps extends BaseModel {

  @Column({
    type: 'string'
    })
  xml: string

  @Column({
    type: 'number'
    })
  storeId: number

  @Column({
    type: 'string'
    })
  url: string

  @Column({
    type: 'string'
    })
  tenant: string
}