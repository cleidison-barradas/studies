import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Store } from '../master/Store'
import { IntegrationErp } from './../integration/IntegrationErp'

@Entity({ name: 'storeIntegration' }, ConnectionType.Store)
export class StoreIntegration extends BaseModel {
  @Column()
  store: Store

  @Column()
  erp: IntegrationErp

  @Column({
    type: 'array',
    default: []
    })
  fields: string[]

  @Column({
    type: 'boolean',
    default: false
    })
  onlyFractioned: boolean
}
