/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FindManyOptions, FindOneOptions } from 'typeorm'
import { ColumnMetadata } from 'typeorm/lib/metadata/ColumnMetadata'
import { ObjectID } from './ObjectID'

const _SoftDeleteCondition_ = {
  deletedAt: null
  //'$or': [ { deletedAt: null }, { deletedAt: { '$exists': false } } ]
}

export const parseObjectIds = (obj: any, columnsMetadata: ColumnMetadata[]): any => {
  if (obj instanceof Array) {
    obj.forEach((v, index) => {
      obj[index] = parseObjectIds(v, columnsMetadata)
    })
  } else {
    Object.keys(obj || {}).forEach(key => {
      if (typeof obj[key] === 'string' && ObjectID.isValid(obj[key])) {
        const col = columnsMetadata.find(v => v.propertyName === key)
        if (col && (!col.type || col.type instanceof ObjectID)) {
          obj[key] = new ObjectID(obj[key].toString())
        }
      }

      if (typeof obj[key] === 'object' && !ObjectID.isValid(obj[key])) {
        obj[key] = parseObjectIds(obj[key], columnsMetadata)
      }
    })
  }

  return obj
}

export const findManyOptionsParser = <T>(optionsOrConditions?: FindManyOptions<T> | Partial<T>, columnsMetadata?: ColumnMetadata[]): FindManyOptions<T> => {
  if (!optionsOrConditions) {
    return {
      where: {
        ..._SoftDeleteCondition_
      }
    }
  }

  // Typing
  optionsOrConditions = optionsOrConditions as FindManyOptions<T>

  optionsOrConditions['where'] = parseObjectIds(optionsOrConditions.where, columnsMetadata)
  if (!optionsOrConditions.withDeleted) {
    optionsOrConditions['where'] = {
      ...optionsOrConditions.where as any,
      ..._SoftDeleteCondition_
    }
  }

  return optionsOrConditions
}

export const findOneOptionsParser = <T>(optionsOrConditions: FindOneOptions<T> | Partial<T>, columnsMetadata: ColumnMetadata[]): FindOneOptions<T> => {
  if ((optionsOrConditions as any).where) {
    // Typing
    optionsOrConditions = optionsOrConditions as FindOneOptions<T>

    optionsOrConditions.where = parseObjectIds(optionsOrConditions.where, columnsMetadata)
    if (!optionsOrConditions.withDeleted) {
      optionsOrConditions.where = {
        ...optionsOrConditions.where as any,
        ..._SoftDeleteCondition_
      }
    }
  }

  return optionsOrConditions
}