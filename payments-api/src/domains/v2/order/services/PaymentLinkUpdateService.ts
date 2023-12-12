import { CartRepository, ObjectID, PaymentLinkRepository } from '@mypharma/api-core'

interface RequestPaymentLinkUpdateServiceDTO {
  tenant: string
  paymentLinkId: ObjectID
}

class PaymentLinkUpdateService {
  public async deletePaymentLink({ tenant, paymentLinkId }: RequestPaymentLinkUpdateServiceDTO) {
    await CartRepository.repo(tenant).deleteOne({
      _id: new ObjectID(paymentLinkId),
    })

    return PaymentLinkRepository.repo(tenant).deleteOne({
      _id: new ObjectID(paymentLinkId),
    })
  }
}

export default PaymentLinkUpdateService
