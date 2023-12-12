/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectID, StoreRepository } from '@mypharma/api-core'

interface StoreGetStoreByStoreIdsServiceDTO {
  storeIds: any[]
}

class StoreGetStoreByStoreIdsService {
  constructor(private repository?: any) { }

  public async getStoreByStoreIds({ storeIds }: StoreGetStoreByStoreIdsServiceDTO) {

    if (!storeIds || storeIds.length <= 0) return []

    return StoreRepository.repo().find({
      where: {
        _id: { $in: storeIds.map(_id => new ObjectID(_id)) }
      }
    })
  }
}

export default StoreGetStoreByStoreIdsService