import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { City } from './City'

@Entity({ name: 'neighborhood' }, ConnectionType.Master)
export class Neighborhood extends BaseModel {
  @Column({
    type: 'string'
    })
  name: string

  @Column()
  city: City

  @Column()
  deliverable : boolean
}
