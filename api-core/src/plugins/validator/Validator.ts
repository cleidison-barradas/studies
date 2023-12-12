/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Validator from 'validatorjs'
import { getMetadataArgsStorage } from 'typeorm'
import { ObjectID } from '../../helpers/ObjectID'
import { Exception } from '../../exceptions/Exception'

// Custom
Validator.register('objectId', (value: string) => ObjectID.isValid(value), 'The :attribute is not a valid Object ID')
Validator.registerAsync('exists', async (value: any, attr: any, req: any, passes) => {
  const [ targetName, tenant, field ] = attr.split(',')
  const metadata = getMetadataArgsStorage().entityRepositories.filter(v => !!v.entity).find(v => (v.entity as any).name === targetName) as any
  
  if (metadata) {
    const repository = metadata.target as any

    if (ObjectID.isValid(value)) {
      value = new ObjectID(value) 
    }

    const where = {
      ...field ? { [field]: value } : { '_id': value }
    }

    const result = await repository.repo(tenant || process.env.DATABASE_MASTER_NAME).findOne({
      select: ['_id'],
      where
    })

    return passes(!!result)
  }

  // Default
  passes()
}, 'The :attribute not exists')

Validator.registerAsync('not_exists', async (value: any, attr: any, req: any, passes) => {
  const [ targetName, tenant, field ] = attr.split(',')
  
  const metadata = getMetadataArgsStorage().entityRepositories.filter(v => !!v.entity).find(v => (v.entity as any).name === targetName) as any
  const tenantName = tenant || process.env.DATABASE_MASTER_NAME

  if (metadata) {
    const repository = metadata.target as any

    if (ObjectID.isValid(value)) {
      value = new ObjectID(value) 
    }

    const where = {
      ...field ? { [field]: value } : { [req]: value }
    }

    const result = await repository.repo(tenantName).findOne({
      select: ['_id'],
      where
    })

    return passes(!result)
  }

  passes()
}, 'The :attribute already exists')

export function Validate(rules: Record<any, any>): Function {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value
    descriptor.value = async (data: any, ...args: any[]) => {
      try {
        await MakeValidation(data, rules)

        return method.call(target, data, ...args)
      } catch (err) {
        return Exception.ValidationErrorException(err)
      }
    }
  }
}

const MakeValidation = (data: Record<any, any>, rules: Record<any, string>) => {
  const validation = new Validator(data, rules)

  return new Promise((resolve, reject) => {
    if (validation.hasAsync) {
      // Fails or Passes :)
      validation.checkAsync(() => resolve(true), () => reject(validation.errors.all()))
    } else {
      if (validation.fails()) {
        reject(validation.errors.all())
      } else {
        resolve(true)
      }
    }
  })
}
