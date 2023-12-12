import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { MonitorStatus } from '../../interfaces/integration/MonitorStatus'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { IntegrationUser } from './IntegrationUser'

@Entity({ name: 'monitor_session' }, ConnectionType.Integration)
export class IntegrationMonitorSession extends BaseModel {
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
  socketSession: string

  @Column({
    type: 'text'
    })
  coreVersion: string

  @Column({
    type: 'text'
    })
  monitorVersion: string

  @Column({
    type: 'text'
    })
  currentStatus: string

  @Column({
    type: 'array'
    })
  process: MonitorStatus[]

  @Column({
    type: 'boolean'
    })
  connected: boolean

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => new Date()
    })
  lastSeen: Date
}
