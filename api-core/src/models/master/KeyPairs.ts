import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'key_pairs' }, ConnectionType.Master)
export class KeyPairs extends BaseModel {
  @Column({
    type: 'string'
    })
  name: string

  @Column({
    type: 'string'
    })
  privateKey: string

  @Column({
    type: 'string'
    })
  publicKey: string
}
