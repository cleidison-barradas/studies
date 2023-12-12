import { ObjectId } from 'bson'
import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

export enum Team {
  TECHNOLOGY = 'TECHNOLOGY',
  COMMERCIAL = 'COMMERCIAL',
  IMPLANTATION = 'IMPLANTATION',
}

export type FaturAgil = {
  billingId: number
  competence?: string
  paymentDate?: Date
}


@Entity({ name: 'notificationslack' }, ConnectionType.Master)
export class NotificationSlack extends BaseModel {
  @Column({
    type: 'enum',
    enum: Team,
    default: Team.COMMERCIAL
    })
  team: Team

  @Column({
    type: 'json'
    })
  faturAgil?: FaturAgil


  @Column({
    type: 'boolean'
    })
  notificationSent: boolean

  @Column()
  storeId?: ObjectId
}
