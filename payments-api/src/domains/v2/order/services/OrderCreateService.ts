import { Order, OrderRepository } from "@mypharma/api-core"

interface RequestOrderCreateServiceDTO {
  order: Order
  tenant: string
}

class OrderCreateService {

  public async execute({ order, tenant }: RequestOrderCreateServiceDTO) {

    return OrderRepository.repo(tenant).createDoc(order)
  }
}

export default OrderCreateService