import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'productDescription' }, ConnectionType.Store)
export class ProductDescription extends BaseModel {
  @Column({
    type: 'string'
    })
  metaTitle: string

  @Column({
    type: 'string'
    })
  metaDescription: string
}
