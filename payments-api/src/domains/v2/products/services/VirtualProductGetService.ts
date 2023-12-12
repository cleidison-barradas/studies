import { VirtualProductRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

interface RequestProductGetServiceDTO {
  tenant: string
  virtualIds: string[]
}

class VirtualProductGetService {

  public async execute({ tenant, virtualIds = [] }: RequestProductGetServiceDTO) {

    if (virtualIds.length <= 0) return []

    const ids = virtualIds.map(id => new ObjectId(id))

    return VirtualProductRepository.repo(tenant).find({
      where: {
        _id: { $in: ids }
      }
    })
  }
}

export default VirtualProductGetService