import { Order, OrderRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

interface RequestOrderUpdateServiceDTO {
  order: Order
  tenant: string
  orderId: string
}

class OrderUpdateService {
  public async execute({ tenant, order, orderId }: RequestOrderUpdateServiceDTO) {
    const orderObjectId = order._id
    const _id = new ObjectId(orderId)
    order.updatedAt = new Date()
    delete order._id

    await OrderRepository.repo(tenant).updateOne({ _id }, { $set: { ...order } })
    order._id = orderObjectId

    return OrderRepository.repo(tenant).findById(_id)
  }
}

export default OrderUpdateService
