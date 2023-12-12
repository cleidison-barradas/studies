import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'openingHour' }, ConnectionType.Store)
export class OpeningHour extends BaseModel {
  @Column({
    type: 'text',
    enum: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'HOLIDAY'],
    })
  weekDay: string

  @Column({
    type: 'string'
    })
  openingTime: string

  @Column({
    type: 'string'
    })
  closingTime: string
}
