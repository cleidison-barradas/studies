import { ProductRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

interface RequestProductGetServiceDTO {
  tenant: string
  productIds: string[]
}

class ProductGetService {

  public async execute({ tenant, productIds = [] }: RequestProductGetServiceDTO) {

    if (productIds.length <= 0) return []

    const ids = productIds.map(id => new ObjectId(id))

    return ProductRepository.repo(tenant).find({
      where: {
        _id: { $in: ids }
      }
    })
  }
}

export default ProductGetService