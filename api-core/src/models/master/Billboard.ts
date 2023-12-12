import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Store } from './Store'

export enum BillboardType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

@Entity({ name: 'billboard' }, ConnectionType.Master)
export class Billboard extends BaseModel {
  @Column({
    type: 'text',
    })
  message: string

  @Column({
    type: 'text'
    })
  title: string

  @Column()
  stores: Store['_id'][]

  @Column({
    type: 'boolean',
    default: true
    })
  active: boolean

  @Column()
  startAt: Date

  @Column()
  endAt: Date

  @Column({type : 'enum',enum : BillboardType,default : BillboardType.INFO})
  type : BillboardType

}
