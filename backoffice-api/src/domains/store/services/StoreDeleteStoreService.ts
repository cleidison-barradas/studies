/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IntegrationLogRepository, ObjectID, ORM, StoreRepository } from '@mypharma/api-core'
import { integration } from '../../../config/database'

interface StoreDeleteStoreServiceDTO {
  tenant: string
  storeId: string
}

class StoreDeleteStoreService {
  constructor(private repository?: any) { }

  public async deleteStore({ storeId, tenant }: StoreDeleteStoreServiceDTO) {
    const _id = new ObjectID(storeId)

    await StoreRepository.repo().deleteOne({ _id })

    await ORM.setup(null, integration)

    await IntegrationLogRepository.repo(integration).deleteMany({ tenant })

    return _id
  }
}

export default StoreDeleteStoreService