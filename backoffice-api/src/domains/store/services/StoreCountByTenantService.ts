/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StoreRepository } from '@mypharma/api-core'

interface StoreCountByTenantServiceDTO {
  tenant: string
}

class StoreCountByTenantService {
  constructor(private repository?: any) { }

  public async getCountStoreByTenant({ tenant }: StoreCountByTenantServiceDTO) {

    return StoreRepository.repo().count({ tenant })
  }
}

export default StoreCountByTenantService