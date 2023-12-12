import { Entity, PrimaryColumn, Column, ObjectID } from 'typeorm'
import { BaseModel } from '../../../../support/models/base/BaseModel'

@Entity()
export class Store extends BaseModel {
  @PrimaryColumn()
  storeId: number | ObjectID

  @Column()
  name: string

  @Column()
  url: string
}
