import { ObjectID, Order, StoneOrder, StoneOrderRepository } from "@mypharma/api-core"

interface RequestStoneUpdateOrderServiceDTO {
  tenant: string
  stoneOrder: StoneOrder,
  order: Order
}

class StoneUpdateOrderService {

  // we use it to update in stoneorder repository
  public async updateStoneOrder({ tenant, stoneOrder, order }: RequestStoneUpdateOrderServiceDTO) {
    const _id = new ObjectID(stoneOrder._id.toString())
    const _orderId = new ObjectID(order._id)

    stoneOrder.order = order
    stoneOrder.order._id = _orderId

    stoneOrder.updatedAt = new Date()
    delete stoneOrder._id


    await StoneOrderRepository.repo(tenant).updateOne(
      { _id },
      { $set: { ...stoneOrder } }
    )

    return StoneOrderRepository.repo(tenant).findById(_id)
  }
}

export default StoneUpdateOrderService
