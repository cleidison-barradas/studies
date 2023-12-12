/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectID, Store, StoreRepository } from '@mypharma/api-core'

interface StoreGetByStoreIdServiceDTO {
  storeId: string
}

class StoreGetByStoreIdService {
  constructor(private repository?: any) { }

  public async getStoreByStoreId({ storeId }: StoreGetByStoreIdServiceDTO) {
    let store = new Store()

    store = await StoreRepository.repo().findById(new ObjectID(storeId))

    if (!store) {

      throw new Error('store_not_found')
    }

    if (store.affiliateStores && store.affiliateStores.length > 0) {

      const affiliateStoreIds = store.affiliateStores?.map(s => new ObjectID(s._id))

      const affiliateStores = await StoreRepository.repo().find({
        where: {
          _id: { $in: affiliateStoreIds }
        }
      })

      store.affiliateStores = affiliateStores as any
    }

    return store
  }
}

export default StoreGetByStoreIdService
