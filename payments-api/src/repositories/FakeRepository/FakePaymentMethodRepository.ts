import { PaymentMethod } from "@mypharma/api-core";
import { PaymentMethodServiceRepository } from "../internals";

class FakePaymentMethodRepository implements PaymentMethodServiceRepository {
  private paymentMethods: PaymentMethod[] = []

  async createDoc(paymentMethod: PaymentMethod): Promise<PaymentMethod> {
    this.paymentMethods.push(paymentMethod)

    return paymentMethod
  }

  async findById(id: string): Promise<PaymentMethod | null> {
    const paymentMethod = this.paymentMethods.find(payment => payment._id.toString() === id)

    return paymentMethod
  }
}

export default FakePaymentMethodRepository

