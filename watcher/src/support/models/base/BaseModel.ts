import { BaseEntity, ObjectIdColumn, ObjectID, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export class BaseModel extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
