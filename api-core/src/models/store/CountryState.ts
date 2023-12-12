import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Country } from './Country'

@Entity({ name: 'state' }, ConnectionType.Master)
export class CountryState extends BaseModel {
  @Column({
    type: 'text'
    })
  name: string

  @Column({
    type: 'text'
    })
  code: string

  @Column()
  country: Country
}
