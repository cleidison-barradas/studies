import { ObjectID } from 'mongodb'
import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { GenericObject } from '../../interfaces/generics/GenericObject'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'request' }, ConnectionType.Log)
export class RequestLog extends BaseModel {
  @Column({
    type: 'text'
    })
  url: string

  @Column({
    type: 'text'
    })
  method: string

  @Column({
    type: 'number'
    })
  statusCode: number

  @Column({
    type: 'text'
    })
  statusMessage: string

  @Column({
    type: 'jsonb'
    })
  body: GenericObject | null

  @Column({
    type: 'jsonb'
    })
  headers: GenericObject

  @Column()
  sessionId: ObjectID

  @Column({
    type: 'text'
    })
  sessionModel: string

  @Column()
  userId: ObjectID

  @Column({
    type: 'text'
    })
  userModel: ObjectID
}
