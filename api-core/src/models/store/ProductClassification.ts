import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'classification' }, ConnectionType.Store)
export class ProductClassification extends BaseModel {
  @Column({
    type: 'string',
    nullable: false
    })
  name: string
}
