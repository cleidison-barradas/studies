import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'control' }, ConnectionType.Store)
export class ProductControl extends BaseModel {
  @Column({
    type: 'string',
    nullable: false
    })
  description: string

  @Column({
    type: 'string',
    nullable: false
    })
  initials: string
}
