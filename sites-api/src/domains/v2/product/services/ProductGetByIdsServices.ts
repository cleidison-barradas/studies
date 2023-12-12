import { ProductRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

interface RequestProductByIdsServiceDTO {
  tenant: string
  productIds: string[]
}

class ProductGetByIdsService {
  public async execute({ productIds, tenant }: RequestProductByIdsServiceDTO) {
    if (productIds.length <= 0) return []

    const _ids = productIds.map((id) => new ObjectId(id))

    return ProductRepository.repo(tenant).find({
      where: { _id: { $in: _ids } },
    })
  }
}

export default ProductGetByIdsService
