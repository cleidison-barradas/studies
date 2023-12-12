import { StoreRepository } from "@mypharma/api-core"

interface StoreGetAllStoreServiceDTO {
  invalidatedTenants?: string[]
}

class StoreGetAllStoreService {
  constructor(private repository?: any) { }

  public async getAllStore({ invalidatedTenants = [] }: StoreGetAllStoreServiceDTO) {
    let where: Record<string, any> = {}

    if (invalidatedTenants && invalidatedTenants.length > 0) {
      where['tenant'] = { $nin: invalidatedTenants }
    }

    if (!this.repository) {

      return StoreRepository.repo().find({
        where,
        select: ['tenant']
      })
    }
  }
}

export default StoreGetAllStoreService