import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { IntegrationOptions } from './IntegrationOptions'

export interface IntegrationData {
  client_id?: string,
  client_secret?: string,
  password?: string,
  username?: string,
  url?: string,
  token?: string
  markup?: number
  cnpj?: string
}

@Entity({ name: 'IntegrationMethods' }, ConnectionType.Store)
export class IntegrationMethods extends BaseModel {

  @Column()
  integrationOption: IntegrationOptions

  @Column()
  integrationData: IntegrationData

  @Column({
    type: 'text'
    })
  lastIntegration?: Date

  @Column({
    type: 'boolean'
    })
  active: boolean

}
