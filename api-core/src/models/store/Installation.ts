import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'installation' }, ConnectionType.Store)
export class Installation extends BaseModel {
  @Column({
    type: 'string',
    })
  userAgent: string

  @Column({
    type: 'string',
    })
  clientIP: string
}
