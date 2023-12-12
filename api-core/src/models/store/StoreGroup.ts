import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Store } from '../master/Store'

@Entity({ name: 'storeGroup' }, ConnectionType.Master)
export class StoreGroup extends BaseModel {
  @Column({
    type: 'string'
    })
  name: string

  @Column()
  stores: Store[]
}
