import { Column } from 'typeorm'
import {  GenericObject } from '../..'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Store } from './Store'



@Entity({ name: 'search' }, ConnectionType.Master)
export class Search extends BaseModel {
  @Column({
    type: 'text',
    })
  fingerprint: string

  @Column({
    type: 'text'
    })
  term: string

  @Column()
  store: Store

  @Column()
  user: GenericObject

  @Column({
    type: 'text'
    })
  userAgent: string

  @Column({
    type: 'boolean'
    })
  converted: boolean

  @Column({
    type: 'array'
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any[]

}
