import { OrderRepository } from "@mypharma/api-core"
import { ObjectId } from 'bson'

interface RequestGetOrdersByCustomerIdServiceDTO {
  tenant: string
  customerId: string
}

class OrdersGetByIdCustomerService {

  public async getOrdersByCustomerId({ tenant, customerId }: RequestGetOrdersByCustomerIdServiceDTO) {

    const orders = await OrderRepository.repo(tenant).find({
      where: {
        'customer._id': { $in: [new ObjectId(customerId), customerId] }
      }
    })

    return orders
  }
}

export default OrdersGetByIdCustomerService