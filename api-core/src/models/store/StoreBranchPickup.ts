import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Address } from './Address'

@Entity({ name: 'storeBrachPickup' }, ConnectionType.Store)
export class StoreBranchPickup extends BaseModel {
  @Column({
    type: 'text',
    nullable: false,
    })
  name: string

  @Column()
  address: Address
}
