import { Customer, CustomerRepository } from "@mypharma/api-core"
import { ObjectId } from "bson"


interface CustomerGetByCustomerIdServiceDTO {
  tenant: string
  customerId: string
}

class CustomerGetByCustomerIdService {
  constructor(private repository?: any) { }

  public async getCustomerByCustomerId({ tenant, customerId }: CustomerGetByCustomerIdServiceDTO) {
    let customer = new Customer()

    if (!this.repository) {

      customer = await CustomerRepository.repo(tenant).findOne({
        where: {
          $or: [
            { subscribed: false },
            { subscribed: { $exists: false } },
          ],
          _id: new ObjectId(customerId)
        },
        select: ['_id', 'fullName', 'email']
      })
    }

    if (!customer) {

      throw new Error('customer_not_found')
    }

    return customer
  }
}

export default CustomerGetByCustomerIdService