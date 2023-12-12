import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Store } from '../master/Store'

@Entity({ name: 'integrationauth' }, ConnectionType.Integration)
export class IntegrationAuth extends BaseModel {
  @Column({ type: 'string' })
  key: string

  @Column({ type: 'string' })
  secret: string

  @Column({ type: 'boolean', default: true })
  active: boolean
}
