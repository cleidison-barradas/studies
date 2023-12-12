import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'relatedProductsCache' }, ConnectionType.Master)
export class RelatedProductsCache extends BaseModel {
  @Column({
    type: 'text',
    })
  ean: string

  @Column({
    type: 'text',
    })
  relatedProducts: string[]

  @Column({
    type: 'datetime',
    default: () => new Date()
    })
  createdAt: Date

  @Column({
    type: 'datetime',
    default: () => new Date()
    })
  updatedAt: Date
}
