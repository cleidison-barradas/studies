import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'file' }, ConnectionType.Store)
export class File extends BaseModel {
  @Column({
    type: 'string'
    })
  name: string

  @Column({
    type: 'string'
    })
  url: string

  @Column({
    type: 'string'
    })
  key: string

  @Column({
    type: 'string'
    })
  folder: string
}
