import { VirtualProductRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

interface RequestProductByIdsServiceDTO {
  tenant: string
  virtualProductIds: string[]
}

class ProductGetByIdsService {
  public async execute({ virtualProductIds, tenant }: RequestProductByIdsServiceDTO) {
    if (virtualProductIds.length <= 0) return []

    const _ids = virtualProductIds.map((id) => new ObjectId(id))

    return VirtualProductRepository.repo(tenant).find({
      where: { _id: { $in: _ids } },
    })
  }
}

export default ProductGetByIdsService
