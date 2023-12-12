import { PagseguroOrder, PagseguroOrderRepository } from "@mypharma/api-core"
import { ObjectId } from "bson"

interface RequestPagseguroGetPagseguroOrderByOrderIdServiceDTO {
  tenant: string
  orderId: string
}

class PagseguroGetPagseguroOrderByOrderIdService {

  constructor(private repository?: any) { }

  public async getPagseguroOrderByStoreOrderId({ tenant, orderId }: RequestPagseguroGetPagseguroOrderByOrderIdServiceDTO) {
    let order = new PagseguroOrder()

    if (!this.repository) {
      order = await PagseguroOrderRepository.repo(tenant).findOne({
        where: {
          'order._id': { $in: [new ObjectId(orderId), orderId] }
        }
      })
    }

    if (!order) {

      throw new Error('pagseguro_order_not_found')
    }

    return order
  }
}

export default PagseguroGetPagseguroOrderByOrderIdService