import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'benefit' }, ConnectionType.Store)
export class Benefit extends BaseModel {
  @Column({
    type: 'number'
    })
  benefitId: number

  @Column({
    type: 'text'
    })
  benefitName: string

  @Column({
    type: 'text'
    })
  siteUrl: string

  @Column({
    type: 'text'
    })
  phone: string

  @Column({
    type: 'boolean'
    })
  allowCustomMembership: boolean

  @Column({
    type: 'boolean'
    })
  allowCustomMembershipPDV: boolean

  @Column({
    type: 'boolean'
    })
  requiresMembership: boolean

  @Column({
    type: 'number'
    })
  clientId: number

  @Column({
    type: 'text'
    })
  clientName: string

  @Column({
    type: 'number'
    })
  authenticationDocument: number
}
