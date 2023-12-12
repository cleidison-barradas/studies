import { Column } from 'typeorm'
import { GenericObject } from '../..'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'importhistory' }, ConnectionType.Store)
export class ImportHistory extends BaseModel {
  
  @Column({
    type: 'string',
    })
  path: string

  @Column({
    type: 'json',
    })
  logs: GenericObject

  @Column({
    type: 'number',
    })
  total: number

  @Column({
    type: 'string',
    })
  title: string

  @Column({
    type: 'number',
    })
  processed: number

  @Column({
    type: 'number',
    })
  failures: number

  @Column({
    type: 'string',
    enum: ['product', 'promotion', 'default']
    })
  module: string

  @Column({
    type: 'string',
    enum: ['finished', 'pending', 'failure']
    })
  status: string

  @Column({
    type: 'array',
    })
  importData: [
    {
      EAN: string
      name: string
      price: string
      action: string
      message: string
      quantity: string
      presentation: string
    }
  ]
}
