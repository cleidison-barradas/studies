/* eslint-disable @typescript-eslint/no-explicit-any */
import { Billboard, BillboardRepository } from '@mypharma/api-core'
import { DeleteWriteOpResultObject } from 'typeorm'
import { ObjectId } from 'bson'
import { startOfDay, endOfDay } from 'date-fns'
import StoreGetStoreByStoreIdsService from '../store/services/StoreGetStoreByStoreIdsService'

const storeGetStoreByStoreIdsService = new StoreGetStoreByStoreIdsService()

const { DATABASE_MASTER_NAME } = process.env

export class BillboardService {

  find(): Promise<Billboard[] | Billboard> {
    return BillboardRepository.repo(DATABASE_MASTER_NAME).find()
  }

  async findById(id: string): Promise<Billboard> {
    const billboard = await BillboardRepository.repo(DATABASE_MASTER_NAME).findById(new ObjectId(id) as any)
    if (!billboard) {
      throw new Error('billboard_not_found')
    }

    const storeIds = billboard.stores.map(id => id.toString())

    const stores = await storeGetStoreByStoreIdsService.getStoreByStoreIds({ storeIds })

    billboard.stores = stores as any

    return billboard
  }

  save(data: Billboard): Promise<Billboard> {
    data.startAt = startOfDay(new Date(data.startAt))
    data.endAt = endOfDay(new Date(data.endAt))
    data.stores = data.stores.map((value) => new ObjectId(value as any)) as any
    return BillboardRepository.repo(DATABASE_MASTER_NAME).createDoc(data)
  }

  delete(id: string): Promise<DeleteWriteOpResultObject> {
    return BillboardRepository.repo().deleteOne({ _id: new ObjectId(id) })
  }
}
