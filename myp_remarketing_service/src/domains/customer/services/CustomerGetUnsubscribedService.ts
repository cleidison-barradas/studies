import { CustomerRepository } from "@mypharma/api-core"
import { ObjectId } from "bson"

interface CustomerGetUnsubscribedServiceDTO {
  tenant: string
  customerId: string
}

class CustomerGetUnsubscribedService {
  constructor(private repository?: any) { }

  public async getCustomerByUnsubiscribed({ tenant, customerId }: CustomerGetUnsubscribedServiceDTO) {
    let count = 0

    if (!this.repository) {
      count = await CustomerRepository.repo(tenant).count({
        where: {
          subscribed: { $exists: true },
          _id: new ObjectId(customerId)
        }
      })
    }

    if (count > 0) return true

    return false
  }
}

export default CustomerGetUnsubscribedService