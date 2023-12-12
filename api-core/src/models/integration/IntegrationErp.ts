import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { IntegrationErpVersion } from './IntegrationErpVersion'

@Entity({ name: 'erp' }, ConnectionType.Integration)
export class IntegrationErp extends BaseModel {
  @Column({
    type: 'text'
    })
  name: string

  @Column({
    type: 'boolean'
    })
  apiIntegration: boolean

  @Column(() => IntegrationErpVersion)
  versions: IntegrationErpVersion[]
}
