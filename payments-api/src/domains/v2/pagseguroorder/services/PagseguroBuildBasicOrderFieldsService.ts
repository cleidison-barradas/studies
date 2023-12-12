import { Order, PagseguroOrder } from "@mypharma/api-core"

interface RequestPagseguroBuildBasicOrderFieldsServiceDTO {
  order: Order
  status: number
}

class PagseguroBuildBasicOrderFieldsService {

  public generatePagseguroBasicOrderFields({ order, status = 1 }: RequestPagseguroBuildBasicOrderFieldsServiceDTO) {
    let pagseguroOrder = new PagseguroOrder()

    pagseguroOrder._id = undefined
    pagseguroOrder.order = order
    pagseguroOrder.status = status
    pagseguroOrder.pagseguroId = null
    pagseguroOrder.createdAt = new Date()

    return pagseguroOrder
  }
}

export default PagseguroBuildBasicOrderFieldsService