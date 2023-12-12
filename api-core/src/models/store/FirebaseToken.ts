import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'firebaseToken' }, ConnectionType.Store)
export class FirebaseToken extends BaseModel {
  @Column()
  userID: string

  @Column()
  storeID: string

  @Column()
  token: string
}
