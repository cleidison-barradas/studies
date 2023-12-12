import { PaymentMethodRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

export function GetPayments(tenant: string, id: string) {
  return PaymentMethodRepository.repo<PaymentMethodRepository>(tenant).findOne({
    where: {
      $or: [
        { _id: id },
        { _id: new ObjectId(id) },
        { 'paymentOption._id': id },
        { 'paymentOption._id': new ObjectId(id) }
      ]
    }
  })
}

export function getPaymentByOptionID(tenant: string, id: string) {
  return PaymentMethodRepository.repo<PaymentMethodRepository>(tenant).findOne({
    where: {
      'paymentOption._id': id,
    },
  })
}
