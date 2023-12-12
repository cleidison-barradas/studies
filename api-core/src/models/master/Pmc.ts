import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'pmcregions' }, ConnectionType.Master)
export class Pmc extends BaseModel {
  @Column({
    type: 'string'
    })
  name: string

  @Column({
    type: 'number'
    })
  originalId: number
}
