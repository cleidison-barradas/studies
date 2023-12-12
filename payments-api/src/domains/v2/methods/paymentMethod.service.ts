import { PaymentMethodRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

export function GetPaymentMethods(tenant: string) {
  return PaymentMethodRepository.repo<PaymentMethodRepository>(tenant).find({})
}

export function getPaymentMethodByType(tenant: string, type: string | RegExp) {
  return PaymentMethodRepository.repo(tenant).findOne({
    where: {
      'paymentOption.type': type,
    },
  })
}

export function getPaymentMethodByName(tenant: string, name: string | RegExp ) {
  return PaymentMethodRepository.repo(tenant).findOne({
    where: {
      'paymentOption.name': name,
    },
  })
}

export function getPaymentMethodByID(tenant: string, id: string) {
  return PaymentMethodRepository.repo(tenant).findOne({
    where: {
      _id: id,
    },
  })
}

export function getPaymentMethodByOptionID(tenant: string, id: string) {
  return PaymentMethodRepository.repo(tenant).findOne({
    where: {
      'paymentOption._id': {
        $in: [id, new ObjectId(id)],
      },
    },
  })
}
