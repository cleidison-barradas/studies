import { Store, StoreRepository } from "@mypharma/api-core"

interface RequestStoreGetByTenantServiceDTO {
  tenant: string
}

class StoreGetByTenantService {
  constructor(private repository?: any) { }

  public async getStoreByTenant({ tenant }: RequestStoreGetByTenantServiceDTO) {
    let store = new Store()

    if (!this.repository) {
      store = await StoreRepository.repo().findOne({
        where: { tenant }
      })
    }

    if (!store) {

      throw Error('store_not_found')
    }

    return store
  }
}

export default StoreGetByTenantService