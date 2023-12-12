import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { GenericObject } from '../../interfaces/generics/GenericObject'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { PaymentOption } from './PaymentOption'
import { InstallmentsDetails } from './InstallmentsDetails'
interface Details {
  payment_type?: string,
  payment_method?: string,
  payment_installments?: number,
  payment_maxInstallments?: number,
  payment_quota?: number,
  payment_additional_info?: string,
  payment_interest?: number,
  external ?: boolean
  externalId ?: string
}

@Entity({ name: 'paymentMethods' }, ConnectionType.Store)
export class PaymentMethod extends BaseModel {
  @Column({
    type: 'array'
    })
  extras: GenericObject[]

  @Column()
  details?: Details

  @Column()
  paymentOption: PaymentOption

  @Column()
  installmentsDetails?: InstallmentsDetails

  @Column({
    type: 'boolean'
    })
  active: boolean
}
