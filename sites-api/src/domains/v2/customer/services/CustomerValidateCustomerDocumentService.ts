import { CustomerRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

interface CustomerValidateCustomerDocumentServiceDTO {
  tenant: string
  document: string
  customerId: string
}

class CustomerValidateCustomerDocumentService {
  constructor(private repository?: any) {}

  public formatDocument(document: string) {
    return document.replace(/\D+/g, '')
  }

  public async validateCustomerDocument({ tenant, document, customerId }: CustomerValidateCustomerDocumentServiceDTO) {
    const cpf = document.replace(/\D+/g, '')
    const _id = new ObjectId(customerId)

    if (cpf.length > 0) {
      const count = await CustomerRepository.repo(tenant).count({ cpf, _id: { $ne: _id } })

      if (count > 0) {
        throw new Error('document_already_exists')
      }
    }

    return cpf
  }
}

export default CustomerValidateCustomerDocumentService
