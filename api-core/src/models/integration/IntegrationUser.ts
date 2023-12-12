import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Store } from '../master/Store'
import { IntegrationErpVersion } from './IntegrationErpVersion'

@Entity({ name: 'user' }, ConnectionType.Integration)
export class IntegrationUser extends BaseModel {
  @Column(() => Store)
  store: Store

  @Column()
  storeOriginalId: number
  
  @Column()
  storeOriginalName: string

  @Column(() => IntegrationErpVersion)
  erpVersion: IntegrationErpVersion

  @Column({
    type: 'text'
    })
  username: string

  @Column({
    type: 'text'
    })
  password: string

  @Column({
    type: 'text'
    })
  salt: string

  @Column({
    type: 'boolean',
    default: true
    })
  active: boolean
}
