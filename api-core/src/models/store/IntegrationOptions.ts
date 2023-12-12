import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'integrationoptions' }, ConnectionType.Store)
export class IntegrationOptions extends BaseModel {
  @Column({
    type: 'string'
    })
  name: string

  @Column({
    type: 'text',
    enum: ['PLUGTO', 'DOCAS', 'BUSCAPE', 'COTEFACIL', 'CLIQUEFARMA', 'CONSULTAREMEDIOS', 'FACEBOOKSHOPPING', 'GOOGLESHOPPING', 'PRODUCTSFARMACIASDELIVERY', 'NEIGHBORHOODSFARMACIASDELIVERY'],
    })
  type: string
}
