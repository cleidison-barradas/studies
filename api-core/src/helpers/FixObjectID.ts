/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseModel } from '../models/base/BaseModel'
import { ObjectID } from './ObjectID'

export const RemoveObjectID = (model: BaseModel): BaseModel => {
  Object.keys(model || {}).forEach(key => {
    if (model[key] instanceof ObjectID || ObjectID.isValid(model[key])) {
      delete model[key]
    }
  })

  return model
}

export const FixObjectID = (model: BaseModel | null): BaseModel => {
  if (!model) return null

  Object.keys(model).forEach(key => {
    if (isNaN(model[key]) && ObjectID.isValid(model[key])) {
      model[key] = (model[key] as any).toString()
    }
    else if (typeof model[key] === 'object') {
      model[key] = FixObjectID(model[key])
    }
  })

  return model
}
