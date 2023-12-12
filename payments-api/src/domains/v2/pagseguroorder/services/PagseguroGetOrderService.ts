import { PagseguroOrder, PagseguroOrderRepository } from "@mypharma/api-core"

interface PagseguroGetOrderServiceDTO {
  tenant: string
  orderId?: string
  pagseguroId: string,
}

class PagseguroGetOrderService {

  public async execute({ pagseguroId, tenant }: PagseguroGetOrderServiceDTO) {
    let order = new PagseguroOrder()

    order = await PagseguroOrderRepository.repo(tenant).findOne({
      where: {
        pagseguroId
      }
    })

    if (!order) {

      throw new Error('pagseguro_order_not_found')
    }

    return order
  }
}

export default PagseguroGetOrderService