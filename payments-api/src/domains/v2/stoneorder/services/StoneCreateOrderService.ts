import { Order, StoneOrder, StoneOrderRepository } from '@mypharma/api-core'

interface RequestStoneCreateOrderServiceDTO {
  tenant: string
  order: Order
  charge_id?: string
}

class StoneCreateOrderService {

  public async createStoneOrder({ tenant, order, charge_id = null }: RequestStoneCreateOrderServiceDTO) {
    const stoneOrder = new StoneOrder()

    stoneOrder.order = order
    stoneOrder.charge_id = charge_id
    stoneOrder.createdAt = new Date()

    return StoneOrderRepository.repo(tenant).createDoc(stoneOrder)
  }
}

export default StoneCreateOrderService
