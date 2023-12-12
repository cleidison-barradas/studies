import { Customer, CustomerRepository } from "@mypharma/api-core"
import { ObjectId } from "bson"
import { CustomerServiceRepository } from "../../../../repositories/internals"

interface RequestCustomerGetByIdServiceDTO {
  tenant: string
  customerId: string
}

class CustomerGetByIdService {

  constructor(private repository?: CustomerServiceRepository) { }

  public async findCustomerById({ tenant, customerId }: RequestCustomerGetByIdServiceDTO) {
    let customer: Customer | null = null

    if (!this.repository) {

      customer = await CustomerRepository.repo(tenant).findOne({
        where: {
          _id: new ObjectId(customerId)
        }
      })
    } else {

      customer = await this.repository.findOne(customerId)
    }


    if (!customer) {
      throw new Error('customer_not_found')
    }

    return customer
  }
}

export default CustomerGetByIdService