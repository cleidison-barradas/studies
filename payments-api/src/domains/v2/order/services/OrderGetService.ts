import { Order, OrderRepository } from "@mypharma/api-core"
import { ObjectId } from 'bson'

interface RequestOrderGetServiceDTO {
  tenant: string
  orderId: string
}

class OrderGetService {
  public async execute({ tenant, orderId }: RequestOrderGetServiceDTO) {
    let order = new Order()

    const _id = new ObjectId(orderId)

    order = await OrderRepository.repo(tenant).findById(_id)

    if (!order) {

      throw new Error('order_not_found')
    }

    return order
  }
}

export default OrderGetService