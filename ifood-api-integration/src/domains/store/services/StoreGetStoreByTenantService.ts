import { StoreRepository } from "@mypharma/api-core"

interface StoreGetStoreByTenantServiceDTO {
  tenant: string
}

class StoreGetStoreByTenantService {
  constructor(private repository?: any) { }

  public async getStoreByTenant({ tenant }: StoreGetStoreByTenantServiceDTO) {

    const store = await StoreRepository.repo().findOne({
      where: {
        tenant
      },
      select: ['_id', 'tenant', 'name', 'pmc']
    })

    if (!store) {

      throw new Error('store_not_found')
    }

    return store
  }
}

export default StoreGetStoreByTenantService