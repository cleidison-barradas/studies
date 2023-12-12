/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Column,
  DeleteDateColumn,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
  ObjectID,
  BaseEntity,
  AfterLoad,
  getMongoManager,
  DeepPartial,
  SaveOptions,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm'
import { ObjectID as MongoDbObjectId } from 'mongodb'
import { ConnectionType } from '../../enums/ConnectionType'
import { FixObjectID, RemoveObjectID } from '../../helpers/FixObjectID'
import { ORM } from '../../plugins/orm/ORM'
import { Ctor } from '../../interfaces/generics/Ctor'
import { parseObjectIds } from '../../helpers/findOptionsParser'

type ModelSaveOptions = SaveOptions & {
  tenantName?: string;
}

export abstract class BaseModel extends BaseEntity {
  public connectionType: ConnectionType

  @ObjectIdColumn()
  _id: ObjectID

  @PrimaryGeneratedColumn()
  originalId: number | null

  @Column({
    type: 'datetime',
    default: () => new Date(),
    })
  createdAt: Date

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => new Date(),
    })
  updatedAt: Date

  @DeleteDateColumn({
    type: 'datetime',
    nullable: true,
    })
  deletedAt: Date | null

  public static load<T>(this: Ctor<T>, data: DeepPartial<T>): T {
    const model = new this()

    Object.keys(data).forEach((key) => {
      model[key] = data[key]
    })

    return model
  }

  @AfterLoad()
  protected async afterLoad(): Promise<void> {
    FixObjectID(this)
  }

  @BeforeInsert()
  protected async beforeInsert(): Promise<void> {
    this.createdAt = new Date()
  }

  @BeforeUpdate()
  protected async beforeUpdate(): Promise<void> {
    this.updatedAt = new Date()
  }

  public async save(options?: ModelSaveOptions): Promise<this> {
    if (!this._id || !options || !options.tenantName) {
      return (this.constructor as any).getRepository().save(this, options)
    }

    const modelObjectId = new MongoDbObjectId(this._id.toString())
    this.updatedAt = new Date()

    const manager = getMongoManager(options.tenantName)
    await manager.update(
      (this as any).constructor,
      modelObjectId,
      parseObjectIds(RemoveObjectID(this), []) as any
    )

    // Refetch model
    const refetch = await manager.findOne((this as any).constructor, {
      where: {
        _id: modelObjectId,
      },
    })

    Object.keys(refetch).forEach((key) => {
      this[key] = refetch[key]
    })
  }

  public async softDelete(tenantName?: string): Promise<void> {
    const manager = getMongoManager(tenantName || ORM.config.name)
    await manager.update(
      (this as any).constructor,
      new MongoDbObjectId(this._id.toString()) as any,
      { deletedAt: new Date() }
    )
  }
}
