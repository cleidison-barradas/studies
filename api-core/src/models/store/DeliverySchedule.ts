import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'deliverySchedule' }, ConnectionType.Store)
export class DeliverySchedule extends BaseModel {
  @Column({
    type: 'text',
    enum: [
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
    'HOLIDAY',
    'EVERYDAY',
    'MONTOFRI',
    'SATSUN',
    ],
    })
  weekDay: string

  @Column({
    type: 'text'
    })
  start: Date

  @Column({
    type: 'text'
    })
  end: Date

  @Column({
    type: 'json'
    })
  interval: {
    active: boolean
    intervalStart: Date
    intervalEnd: Date
  }
}
