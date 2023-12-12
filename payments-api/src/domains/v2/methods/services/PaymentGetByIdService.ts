import { PaymentMethod, PaymentMethodRepository } from "@mypharma/api-core"
import { ObjectId } from "bson"
import { PaymentMethodServiceRepository } from "../../../../repositories/internals"

interface RequestPaymentGetByIdServiceDTO {
  tenant: string
  paymentId: string
}

class PaymentGetByIdService {

  constructor(private repository?: PaymentMethodServiceRepository) { }

  public async findPaymentMethodById({ paymentId, tenant }: RequestPaymentGetByIdServiceDTO) {
    let paymentMethod: PaymentMethod | null = null

    if (!this.repository) {

      paymentMethod = await PaymentMethodRepository.repo(tenant).findOne({
        where: {
          _id: new ObjectId(paymentId)
        }
      })
    } else {

      paymentMethod = await this.repository.findById(paymentId)
    }

    if (!paymentMethod) {

      throw new Error('payment_method_not_found')
    }

    return paymentMethod
  }
}

export default PaymentGetByIdService