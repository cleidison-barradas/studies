import { Entity, PrimaryColumn, Column } from 'typeorm'
import { BaseModel } from '../../../../support/models/base/BaseModel'

@Entity()
export class User extends BaseModel {
  @PrimaryColumn()
  userId: number

  @Column()
  firstName: string

  @Column()
  lastName: string
}
