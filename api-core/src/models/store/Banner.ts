import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { GenericObject } from '../../interfaces/generics/GenericObject'

@Entity({ name: 'banner' }, ConnectionType.Store)
export class Banner extends BaseModel {
  @Column({
    type: 'text'
    })
  description: string

  @Column({
    type: 'array'
    })
  image: GenericObject

  @Column({
    type: 'text'
    })
  url: string

  @Column({
    type: 'string',
    nullable: true,
    })
  title: string

  @Column({
    type: 'boolean',
    default: false,
    nullable: true,
    })
  locationAction: boolean
  
  @Column({
    type: 'boolean',
    default: false,
    nullable: true,
    })
  whatsappAction: boolean

  @Column({
    type: 'boolean',
    default: false,
    nullable: true,
    })
  landlineAction: boolean
}
