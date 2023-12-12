import { OrderRepository } from "@mypharma/api-core"
import { ObjectId } from 'bson'

interface RequestOrderDeleteServiceDTO {
  tenant: string
  orderId: string
}

class OrderDeleteService {
  public async execute({ tenant, orderId }: RequestOrderDeleteServiceDTO) {

    return OrderRepository.repo(tenant).delete({ _id: new ObjectId(orderId) })
  }
}

export default OrderDeleteService