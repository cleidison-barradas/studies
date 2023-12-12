import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Category } from './Category'
import { Product } from './Product'

@Entity({ name: 'cupom' }, ConnectionType.Store)
export class Cupom extends BaseModel {
  @Column({
    type: 'string',
    unique: true
    })
  name: string

  @Column({
    type: 'string',
    unique: true
    })
  code: string

  @Column({
    type: 'text',
    default: null
    })
  initialDate: Date

  @Column({
    type: 'text',
    default: null
    })
  finalDate: Date

  @Column({
    type: 'number'
    })
  amount: number

  @Column({
    type: 'number',
    default: 0.0
    })
  minimumPrice: number

  @Column({
    type: 'number'
    })
  descountPercentage: number

  @Column({
    type: 'string',
    enum: ['PRODUCT', 'DELIVERY', 'CATEGORY']
    })
  type: string

  @Column({
    type: 'number',
    default: 0
    })
  timesUsed: number

  @Column()
  descountCategorys: Category['_id'][]

  @Column()
  products: Product['_id'][]

  @Column()
  productBlacklist: Product['EAN'][]

  @Column({
    type: 'boolean',
    default: false
    })
  allProducts: boolean

  @Column({
    type: 'number'
    })
  descountOnProduct: number

  @Column({
    type: 'number'
    })
  descountOnDelivery: number

  @Column({
    type: 'boolean',
    default: true
    })
  status: boolean
}
