import { HistoryOrder, HistoryOrderRepository, Order, StatusOrder } from "@mypharma/api-core"

interface RequestHistoryOrderCreateServiceDTO {
  tenant: string
  order: Order
  notify?: boolean
  comments?: string
  statusOrder: StatusOrder
}

class HistoryOrderCreateService {

  public async execute({ tenant, order, comments = 'pedido realizado', statusOrder, notify = false }: RequestHistoryOrderCreateServiceDTO) {
    let history = new HistoryOrder()

    history.order = order
    history.notify = notify
    history.comments = comments
    history.status = statusOrder
    history.createdAt = new Date()

    return HistoryOrderRepository.repo(tenant).createDoc(history)
  }
}

export default HistoryOrderCreateService