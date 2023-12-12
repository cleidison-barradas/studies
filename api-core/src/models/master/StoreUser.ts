import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Store } from './Store'

@Entity({ name: 'user' }, ConnectionType.Master)
export class StoreUser extends BaseModel {
  @Column({
    type: 'text'
    })
  userName: string

  @Column({
    type: 'text'
    })
  password: string

  @Column({
    type: 'text'
    })
  email: string

  @Column({
    type: 'text'
    })
  refreshToken: string

  @Column(() => Store)
  store: Store[]
}
