import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'category' }, ConnectionType.Store)
export class Category extends BaseModel {
  @Column({
    type: 'string',
    nullable: false
    })
  name: string

  @Column({
    type: 'string',
    default: null
    })
  parentId: string

  @Column({
    type: 'text'
    })
  description: string

  @Column({
    type: 'text',
    default : ''
    })
  image: string

  @Column({
    type: 'number'
    })
  sort: number

  @Column({
    type: 'boolean'
    })
  status: boolean

  @Column()
  subCategories: Category[]

  @Column({
    type: 'text'
    })
  metaTitle: string

  @Column({
    type: 'text'
    })

  metaDescription: string
  @Column({
    type: 'number',
    default : null
    })
  position: number | null
  
}
