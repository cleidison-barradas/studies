import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { IntegrationUser } from './IntegrationUser'

@Entity({ name: 'session' }, ConnectionType.Integration)
export class IntegrationSession extends BaseModel {
  @Column(() => IntegrationUser)
  user: IntegrationUser

  @Column({
    type: 'text'
    })
  token: string

  @Column({
    type: 'text',
    default: null
    })
  privateKey: string

  @Column({
    type: 'text',
    default: null
    })
  publicKey: string

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => new Date()
    })
  lastSeen: Date
}
