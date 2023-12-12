import { PicpayOrder, PicpayOrderRepository } from "@mypharma/api-core"
import { ObjectId } from 'bson'

interface RequestPicpayOrderUpdateServiceDTO {
  tenant: string
  orderId: string
  picpayOrder: PicpayOrder
}

class PicpayOrderUpdateService {

  public async execute({ orderId, tenant, picpayOrder }: RequestPicpayOrderUpdateServiceDTO) {

    delete picpayOrder._id

    const _id = new ObjectId(orderId)

    await PicpayOrderRepository.repo(tenant).updateOne(
      { _id },
      { $set: { ...picpayOrder } }
    )

    return PicpayOrderRepository.repo(tenant).findById(_id)
  }
}

export default PicpayOrderUpdateService