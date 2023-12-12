import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { CountryState } from './CountryState'

@Entity({ name: 'city' }, ConnectionType.Store)
export class City extends BaseModel {
  @Column({
    type: 'text'
    })
  name: string

  @Column()
  state: CountryState
}
