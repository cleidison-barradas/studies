import { OrderRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

interface RequestOrderCountServiceDTO {
  code: string
  tenant: string
  customerId: string
}

class OrderCountService {

  public async execute({ code, tenant, customerId }: RequestOrderCountServiceDTO) {

    return OrderRepository.repo(tenant).count({
      $or: [
        { 'customer._id': customerId },
        { 'customer._id': new ObjectId(customerId) }
      ],
      'cupom.code': code
    })
  }
}

export default OrderCountService