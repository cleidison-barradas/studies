import { ObjectId } from 'bson'
import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'user' }, ConnectionType.Master)
export class User extends BaseModel {

  @Column({
    unique: true,
    })
  userName: string

  @Column()
  salt: string

  @Column()
  password: string

  @Column({
    unique: true
    })
  email: string

  @Column()
  avatar: string

  @Column()
  plan: string

  @Column()
  refreshToken: string

  @Column({
    type: 'array'
    })
  store: ObjectId[]

  @Column({
    type: 'enum',
    enum: ['admin', 'support', 'store'],
    default: 'store'
    })
  role: string

  @Column({
    type: 'boolean',
    default: true
    })
  status: boolean
}
