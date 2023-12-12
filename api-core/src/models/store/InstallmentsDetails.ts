import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

interface StoneInstallmentFee {
  twoToSixFee: number
  sevenToTwelveFee: number
}

interface StoneCardsFlagFee {
  visaFee: StoneInstallmentFee
  masterCardFee: StoneInstallmentFee
  americanExpressFee: StoneInstallmentFee
  hipercardFee: StoneInstallmentFee
  eloFee: StoneInstallmentFee
  cabalFee: StoneInstallmentFee
}

@Entity({ name: 'installmentsDetails' }, ConnectionType.Store)
export class InstallmentsDetails extends BaseModel {

  @Column({
    default: 12
    })
  maxInstallments: number

  @Column({
    default: 0
    })
  minValueToInstallments?: number

  @Column({
    type: 'boolean',
    default: false
    })
  applyInstallmentsFee: boolean

  @Column()
  applyInstallmentsFeeFrom?: number

  @Column({
    type: 'boolean',
    default: true
    })
  manualFee?: boolean

  @Column()
  cardsFlagFee?: StoneCardsFlagFee | unknown
}
