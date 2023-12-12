import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Address } from './Address'

@Entity({ name: 'customer' }, ConnectionType.Store)
export class Customer extends BaseModel {
  @Column({
    type: 'string',
    })
  firstname: string

  @Column({
    type: 'string',
    })
  lastname: string

  @Column({
    type: 'string',
    })
  fullName: string

  @Column({
    type: 'string',
    unique: true
    })
  email: string

  @Column({
    type: 'string',
    })
  phone: string

  @Column({
    type: 'string',
    select: false
    })
  password: string

  @Column({
    type: 'string',
    })
  passwordSalt: string

  @Column({
    type: 'string',
    })
  cpf: string

  @Column()
  addresses: Address[]

  @Column({
    type: 'boolean',
    default: true
    })
  status: boolean

  @Column({
    type: 'boolean',
    default: true
    })
  subscribed: boolean

  @Column({
    type: 'string',
    })
  dialect: string

  @Column({
    type: 'string',
    })
  birthdate: string

  @Column({
    type: 'number',
    default: 0
    })
  totalValue: number

  @Column({
    type: 'number',
    default: 0
    })
  orderTimes: number
}
