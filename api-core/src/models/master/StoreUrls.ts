import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'storeUrls' }, ConnectionType.Master)
export class StoreUrls extends BaseModel {
  @Column({
    type: 'string'
    })
  url_name: string

  @Column({
    type: 'string'
    })
  url_address: string
}
