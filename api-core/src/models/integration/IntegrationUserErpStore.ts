import { Column } from 'typeorm'
import { ObjectId } from 'bson'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'user_erp_store' }, ConnectionType.Integration)
export class IntegrationUserErpStore extends BaseModel {
  @Column()
  user_id: ObjectId

  @Column()
  erp_id: ObjectId
  
  @Column()
  tenant: string

  @Column({
    nullable: true
    })
  token: string
}
