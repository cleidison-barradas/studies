import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { StoreUser } from '../master/StoreUser'

@Entity({ name: 'aboutUs'}, ConnectionType.Store)
export class AboutUs extends BaseModel {
  @Column({
    type: 'text',
    })
  content: string

  @Column({
    type: 'boolean',
    default: false,
    })
  published: boolean

  @Column()
  user: StoreUser
}
