import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Product } from './Product'

@Entity({ name: 'productPromotion' }, ConnectionType.Store)
export class ProductPromotion extends BaseModel {
  @Column({
    type: 'number'
    })
  price: number

  @Column({
    type: 'text',
    default: null
    })
  initialDate: Date

  @Column({
    type: 'text'
    })
  finalDate: Date

  @Column()
  product: Product
}
