import { Order, PicpayOrder, PicpayOrderRepository, StatusOrder } from "@mypharma/api-core"
import { IPicpayStatus } from "../../../../support/interfaces/picpay.plugin"

interface RequestPicpayOrderCreateService {
  order: Order
  tenant: string
  status?: IPicpayStatus
  authorizationId?: string
}

class PicpayOrderCreateService {

  public async execute({ tenant, order, status = 'created', authorizationId = null }: RequestPicpayOrderCreateService) {
    let picpayOrder = new PicpayOrder()

    picpayOrder.order = order
    picpayOrder.status = status
    picpayOrder.authorizationId = authorizationId
    picpayOrder.createdAt = new Date()

    return PicpayOrderRepository.repo(tenant).createDoc(picpayOrder)
  }
}

export default PicpayOrderCreateService 