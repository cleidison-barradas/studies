import { CustomerRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

interface CustomerUpdateCustomerServiceDTO {
  cpf?: string
  phone: string
  tenant: string
  lastname: string
  firstname: string
  customerId: string
}

class CustomerUpdateCustomerService {
  constructor(private repository?: any) { }

  public async updateCustomer({ customerId, tenant, cpf, firstname, lastname, phone }: CustomerUpdateCustomerServiceDTO) {
    const _id = new ObjectId(customerId)

    let customer = await CustomerRepository.repo(tenant).findById(_id)

    if (!customer) {
      throw new Error('customer_not_found')
    }

    await CustomerRepository.repo(tenant).updateOne({ _id: new ObjectId(_id.toString()) }, {
      $set: {
        _id: new ObjectId(_id.toString()),
        cpf,
        phone: phone.replace(/\D+/g, ''),
        lastname,
        firstname,
        fullName: lastname + ' ' + firstname,
        updatedAt: new Date()
      }
    })

    customer = await CustomerRepository.repo(tenant).findById(_id)

    delete customer.password
    delete customer.passwordSalt

    return customer
  }
}

export default CustomerUpdateCustomerService
