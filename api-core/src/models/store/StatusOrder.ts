import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'statusorder' }, ConnectionType.Store)
export class StatusOrder extends BaseModel {

  @Column({
    type: 'number'
    })
  originalId: number

  @Column({
    type: 'string'
    })
  name: string

  @Column({
    type: 'string',
    enum: ['accepted', 'pending', 'rejected']
    })
  type: string
}
