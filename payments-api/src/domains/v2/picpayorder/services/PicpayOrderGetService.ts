import { PicpayOrder, PicpayOrderRepository } from "@mypharma/api-core"
import { ObjectId } from 'bson'

interface RequestPicpayOrderGetServiceDTO {
  tenant: string
  orderId: string
}

class PicpayOrderGetService {

  public async execute({ orderId, tenant }: RequestPicpayOrderGetServiceDTO) {
    let order = new PicpayOrder()

    const _id = new ObjectId(orderId)

    order = await PicpayOrderRepository.repo(tenant).findById(_id)

    if (!order) {

      throw new Error('picpay_order_not_found')
    }

    return order
  }
}

export default PicpayOrderGetService