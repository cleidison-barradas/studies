import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'sdr' }, ConnectionType.Store)
export class Sdr extends BaseModel {
  @Column({
    type: 'string'
    })
  name: string

  @Column({
    type: 'string',
    unique: true
    })
  email: string

  @Column({
    type: 'boolean',
    default: false
    })
  willReceveLeadsEmail: boolean
}
