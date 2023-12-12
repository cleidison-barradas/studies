import { Store, StoreRepository } from '@mypharma/api-core'
import {  FindManyOptions, ObjectLiteral } from 'typeorm'
import { endOfDay, startOfDay } from 'date-fns'

const { DATABASE_MASTER_NAME } = process.env

export async function getStoresByCreatedAt(startDate?: Date, endDate?: Date): Promise<Store[]> {
  const where: ObjectLiteral = {}

  if (startDate && endDate) {
    where['createdAt'] = { $gte: startOfDay(new Date(startDate)), $lte: endOfDay(new Date(endDate)) }
  }

  if (startDate && !endDate) {
    where['createdAt'] = { $gte: startOfDay(new Date(startDate)), $lte: endOfDay(new Date()) }
  }

  if (!startDate && endDate) {
    where['createdAt'] = { $gte: startOfDay(new Date('2000-01-01T00:08:52.308+00:00')), $lte: endOfDay(new Date(endDate)) }
  }

  const optionsOrConditions: FindManyOptions<Store> = {
    where
  }

  const stores = await StoreRepository.repo(DATABASE_MASTER_NAME).find(optionsOrConditions)
  return stores
}
