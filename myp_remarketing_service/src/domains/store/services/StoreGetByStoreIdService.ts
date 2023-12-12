import { Store, StoreRepository } from "@mypharma/api-core"
import { ObjectId } from "bson"

interface StoreGetByStoreIdServiceDTO {
  storeId: string
}

class StoreGetByStoreIdService {
  constructor(private repository?: any) { }

  public async getStoreByStoreId({ storeId }: StoreGetByStoreIdServiceDTO) {
    let store = new Store()

    if (!this.repository) {

      store = await StoreRepository.repo().findById(new ObjectId(storeId))
    }

    if (!store) {

      throw new Error('store_not_found')
    }

    return store
  }
}

export default StoreGetByStoreIdService