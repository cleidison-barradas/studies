import { PaymentLinkRepository } from '@mypharma/api-core'

interface GetPaymentLinkServiceDTO {
  cartId: string
  tenant: string
}

class GetPaymentLinkService {
  public async execute({ tenant, cartId }: GetPaymentLinkServiceDTO) {
    return PaymentLinkRepository.repo(tenant).findOne({ cartId })
  }
}

export default GetPaymentLinkService
