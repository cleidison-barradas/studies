/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAffiliateStore, StoreRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

interface UpdateMainStoreServiceDTO {
  storeId: string
  affiliateStores: IAffiliateStore[]
}

class UpdateMainStoreService {
  constructor(private repository?: any) { }

  public async updateMainStore({ storeId, affiliateStores = [] }: UpdateMainStoreServiceDTO) {

    const _id = new ObjectId(storeId)

    await StoreRepository.repo().updateOne({ _id },
      {
        $set: {
          affiliateStores,
          updatedAt: new Date()
        }
      })

    return StoreRepository.repo().findById(_id)
  }
}

export default UpdateMainStoreService
