import { PicpayOrder, PicpayOrderRepository } from "@mypharma/api-core"
import { ObjectId } from "bson"

interface RequestPicpayOrderGetByStoreOrderIdServiceDTO {
  tenant: string
  orderId: string
}

class PicpayOrderGetByStoreOrderIdService {

  constructor(private repository?: any) { }

  public async getPicpayOrderByStoreOrderId({ tenant, orderId }: RequestPicpayOrderGetByStoreOrderIdServiceDTO) {
    let picpayOrder = new PicpayOrder()

    if (!this.repository) {
      picpayOrder = await PicpayOrderRepository.repo(tenant).findOne({
        where: {
          'order._id': { $in: [new ObjectId(orderId), orderId] }
        }
      })
    }

    if (!picpayOrder) {

      throw Error('picpay_order_not_found')
    }

    return picpayOrder
  }
}

export default PicpayOrderGetByStoreOrderIdService