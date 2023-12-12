import { PagseguroOrder, PagseguroOrderRepository } from "@mypharma/api-core"
import { ObjectId } from 'bson'

interface PagseguroUpdateOrderServiceDTO {
  tenant: string
  order: PagseguroOrder
}

class PagseguroUpdateOrderService {

  public async execute({ order, tenant }: PagseguroUpdateOrderServiceDTO) {
    const _id = new ObjectId(order._id.toString())
    order.updatedAt = new Date()
    delete order._id

    await PagseguroOrderRepository.repo(tenant).updateOne(
      { _id },
      { $set: { ...order } }
    )

    return PagseguroOrderRepository.repo(tenant).findById(_id)
  }
}

export default PagseguroUpdateOrderService