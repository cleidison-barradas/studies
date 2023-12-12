import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { IntegrationSql } from '../../interfaces/integration/IntegrationSql'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { ObjectID } from '../../helpers/ObjectID'
import { IntegrationSchema } from '../../interfaces/integration/IntegrationSchema'

@Entity({ name: 'erpVersion' }, ConnectionType.Integration)
export class IntegrationErpVersion extends BaseModel {
  @Column({
    type: 'text'
    })
  name: string

  @Column()
  erpId: ObjectID

  @Column({
    type: 'array'
    })
  sql: IntegrationSql[]

  @Column({
    type: 'boolean',
    default: false
    })
  multistore: boolean

  @Column({
    type: 'array',
    default: []
    })
  storeIdentifiers: string[]

  @Column({
    type: 'string'
    })
  identifierField: string

  @Column({
    type: 'array'
    })
  schema: IntegrationSchema
}
