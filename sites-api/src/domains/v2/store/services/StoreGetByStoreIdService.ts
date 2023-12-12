import { Store, StoreRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'
import databaseConfig from '../../../../config/database'

interface RequestStoreGetByStoreIdServiceDTO {
  storeId: string
}

class StoreGetByStoreIdService {
  constructor(private repository?: any) { }

  public async getStoreByStoreId({ storeId }: RequestStoreGetByStoreIdServiceDTO) {
    let store = new Store()

    if (!this.repository) {
      const _id = new ObjectId(storeId)

      store = await StoreRepository.repo(databaseConfig.name).findById(_id)
    }

    if (!store) {

      throw Error('store_not_found')
    }

    return store
  }
}

export default StoreGetByStoreIdService
