import { ObjectID, Pmc, PmcRepository, Store, StoreRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'
import { FindManyOptions } from 'typeorm'
import { IGetErpRequest } from '../erp/interfaces/erp.request'
const { DATABASE_MASTER_NAME } = process.env

export default class PmcService {
  async getPmcs(filters: IGetErpRequest): Promise<Pmc[]> {
    const { limit = 20, name = '', page = 1 } = filters

    const query: FindManyOptions<Pmc> = {
      where: {
        name: new RegExp(name, 'gi'),
      },
      take: Number(limit),
      skip: Number(limit) * (Number(page) - 1),
    }

    return PmcRepository.repo(DATABASE_MASTER_NAME).find(query)
  }

  async getPmc(_id: Pmc['_id']): Promise<Pmc> {
    const id = new ObjectId(_id.toString())

    return PmcRepository.repo(DATABASE_MASTER_NAME).findById(id)
  }

  async setPmcToStore(id: string, store: Store): Promise<void> {
    
    if (id && typeof id !== 'object') {
      const pmc = await PmcRepository.repo(DATABASE_MASTER_NAME).findById(id)
    
      await StoreRepository.repo(DATABASE_MASTER_NAME).updateOne(
        { url: store.url },
        {
          $set: {
            pmc: { ...pmc, _id: new ObjectID(pmc._id.toString()) },
          },
        }
      )
    }
  }
}
