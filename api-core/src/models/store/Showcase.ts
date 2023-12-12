import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { GenericObject } from '../../interfaces/generics/GenericObject'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Product } from './Product'

export interface IShowCaseProducts {
  product: Product
  position: number | null
}

@Entity({ name: 'showCase' }, ConnectionType.Store)
export class Showcase extends BaseModel {
  @Column({
    type: 'string'
    })
  name: string

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

  @Column({ type: 'array' })
  products: IShowCaseProducts[]

  @Column({
    type: 'number',
    unique: true,
    nullable: true
    })
  position: number

  @Column({
    type: 'boolean',
    default: true
    })
  status: boolean

  @Column({
    type: 'boolean',
    default: false
    })
  main: boolean

  @Column({
    type: 'boolean'
    })
  smart: boolean

  @Column({
    type: 'json'
    })
  smartFilters: GenericObject
}
