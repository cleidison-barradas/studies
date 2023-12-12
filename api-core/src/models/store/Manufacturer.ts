import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'manufacturer' }, ConnectionType.Store)
export class Manufacturer extends BaseModel {
  @Column({
    type: 'string',
    nullable: false
    })
  name: string

  @Column({
    type: 'string'
    })
  image: string
}
