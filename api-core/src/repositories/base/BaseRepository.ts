/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeStream,
  ChangeStreamOptions,
  DeepPartial,
  EntityTarget,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  MongoRepository,
  ObjectID as TypeORMObjectId,
  ObjectLiteral,
} from 'typeorm'
import { ObjectID } from 'mongodb'
import { ORM } from '../..'
import { BaseModel } from '../../models/base/BaseModel'
import { Ctor } from '../../interfaces/generics/Ctor'
import {
  findOneOptionsParser,
  parseObjectIds,
} from '../../helpers/findOptionsParser'
import {
  PaginationOptions,
  PaginationResponse,
} from '../../interfaces/app/Pagination'
import { EntityFieldsNames } from 'typeorm/lib/common/EntityFieldsNames'

export class BaseRepository<T extends BaseModel> extends MongoRepository<T> {
  public static repo<R = any>(this: Ctor<R>, tenantName?: string): R {
    const _repo = new this()
    return ORM.setupRepository<R>(tenantName || null, _repo)
  }

  protected static wrap(target: () => any): any {
    return target()
  }

  // public find(optionsOrConditions?: FindManyOptions<T> | Partial<T>): Promise<T[]> {
  //   optionsOrConditions = findManyOptionsParser(optionsOrConditions, this.metadata.columns)
  //   return this.manager.find<T>(this.metadata.target, optionsOrConditions)
  // }

  // public findOne(
  //   optionsOrConditions: FindOneOptions<T> | Partial<T>,
  //   maybeOptions?: FindOneOptions<T>
  // ): Promise<T | undefined> {
  //   optionsOrConditions = findOneOptionsParser(
  //     optionsOrConditions,
  //     this.metadata.columns
  //   )
  //   return this.manager.findOne<T>(
  //     this.metadata.target,
  //     optionsOrConditions as any,
  //     maybeOptions
  //   )
  // }

  public findById(_id: string | ObjectID, withDeleted?: boolean): Promise<T> {
    if (typeof _id === 'string') {
      (_id as any) = new ObjectID(_id)
    }

    return this.findOne({
      where: {
        _id,
      },
      withDeleted: withDeleted || false,
    })
  }

  public findByObjectIds(
    ids: string[] | TypeORMObjectId[],
    optionsOrConditions?: Partial<T> | FindManyOptions<T>
  ): Promise<T[]> {
    ids.forEach((id: string | TypeORMObjectId, index) => {
      if (typeof id === 'string') {
        (ids as any)[index] = new ObjectID(id)
      }
    })

    return this.findByIds(ids, optionsOrConditions)
  }

  public findByOriginalId(
    originalId: number,
    withDeleted?: boolean
  ): Promise<T> {
    return this.findOne({
      where: {
        originalId,
      },
      withDeleted: withDeleted || false,
    })
  }

  public findByEans(eans: string[], withDeleted?: boolean): Promise<T[]> {
    return this.find({
      where: {
        EAN: {
          $in: eans,
        },
      },
      withDeleted: withDeleted || false,
    })
  }

  public findByCategory({
    where,
    order,
    take: limit,
    withDeleted = false
  }: {
    where: Record<string, unknown>,
    order: { [P in EntityFieldsNames<T>]?: 'ASC' | 'DESC' | 1 | -1; },
    take: number,
    withDeleted?: boolean
  }): Promise<T[]> {
    return this.find({
      where,
      order,
      take: limit,
      withDeleted
    })
  }




  public async createDoc(entityOrData: T | DeepPartial<T>): Promise<T> {
    entityOrData = parseObjectIds(entityOrData, this.metadata.columns)

    let result: T
    if (entityOrData instanceof BaseModel) {
      result = await this.manager.save(entityOrData as any)
    } else {
      result = (await this.manager.save(
        this.metadata.target,
        entityOrData
      )) as any
    }

    return result
  }

  public watch<T>(
    entityClassOrName: EntityTarget<T>,
    pipeline?: any[],
    options?: ChangeStreamOptions
  ): ChangeStream {
    return this.manager.watch<T>(entityClassOrName, pipeline, options)
  }

  public async paginate(
    where: FindConditions<T>[] | FindConditions<T> | ObjectLiteral | string,
    paginationOptions: PaginationOptions
  ): Promise<PaginationResponse<T>> {
    let { page = 1, limit = 20 } = paginationOptions

    page = Number(page)
    limit = Number(limit)

    const [data, total] = await this.findAndCount({
      where,
      skip: limit * (page - 1),
      take: limit,
    })

    const totalPages = Math.ceil(total / limit)

    return {
      data,
      page,
      limit,
      totalPages,
    }
  }
}
