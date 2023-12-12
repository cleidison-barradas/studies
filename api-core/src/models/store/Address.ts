import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Neighborhood } from './Neighborhood'

@Entity({ name: 'address' }, ConnectionType.Master)
export class Address extends BaseModel {
  @Column({
    type: 'text'
    })
  street: string

  @Column({
    type: 'number'
    })
  number: number

  @Column({
    type: 'text'
    })
  complement: string

  @Column({
    type: 'text'
    })
  postcode: string

  @Column({
    type: 'boolean',
    default: false
    })
  notDeliverable: boolean

  @Column()
  neighborhood: Neighborhood

  @Column({
    type: 'string',
    enum: ['store_pickup', 'own_delivery','delivery_company'],
    default: 'own_delivery'
    })
  addressType: string

  @Column({
    type: 'boolean',
    default: false
    })
  isMain: boolean

  @Column({
    type: 'number'
    })
  latitude: number

  @Column({
    type: 'number'
    })
  longitude: number
}
