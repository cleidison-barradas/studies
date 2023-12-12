import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

import { Sdr } from './SDR'

export type ILeadStatus = 'open' | 'pending' | 'closed'

export type LeadStatus = {
  status: ILeadStatus
  createdAt: Date
  updatedAt: Date
}

@Entity({ name: 'lead' }, ConnectionType.Store)
export class Lead extends BaseModel {
  @Column({
    type: 'string'
    })
  name: string

  @Column({
    type: 'string'
    })
  storeName: string

  @Column({
    type: 'string'
    })
  cnpj: string

  @Column({
    type: 'string'
    })
  storePhone: string

  @Column({
    type: 'string'
    })
  ownerPhone: string

  @Column({
    type: 'string'
    })
  email: string

  @Column({
    type: 'string'
    })
  colaborator: string

  @Column({
    type: 'string'
    })
  colaboratorCpf: string

  @Column({
    type: 'string'
    })
  colaboratorCnpj: string

  @Column({
    type: 'string'
    })
  colaboratorEmail: string

  @Column({
    type: 'string'
    })
  colaboratorPhone: string

  @Column({
    type: 'string',
    enum: ['open', 'pending', 'closed']
    })
  status: ILeadStatus

  @Column({
    type: 'array'
    })
  statusHistory: LeadStatus[]

  @Column()
  sdr: Sdr
}
