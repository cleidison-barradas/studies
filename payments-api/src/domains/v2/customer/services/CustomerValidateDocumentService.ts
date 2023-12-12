import { Customer } from "@mypharma/api-core"

interface CustomerValidateDocumentServiceDTO {
  cpf: string
  customer: Customer
}

class CustomerValidateDocumentService {

  public validateCustomerDocument({ cpf = '', customer }: CustomerValidateDocumentServiceDTO) {

    let document = customer.cpf && customer.cpf.length > 0 ? customer.cpf : cpf

    document = document.replace(/\D/g, '').replace(/\s/g, '')

    if (document.length <= 0) {

      throw new Error('missing_customer_document')
    }

    return document
  }
}

export default CustomerValidateDocumentService