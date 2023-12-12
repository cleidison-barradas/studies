import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'country' }, ConnectionType.Master)
export class Country extends BaseModel {
  @Column({
    type: 'text'
    })
  name: string
}
