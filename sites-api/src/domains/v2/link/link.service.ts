import { CartRepository, ObjectID, PaymentLinkRepository } from '@mypharma/api-core'
import { addDays } from 'date-fns'

export function getPaymentLinks(tenant: string) {
  return PaymentLinkRepository.repo<PaymentLinkRepository>(tenant).find({})
}

export async function getPaymentLinkByFingerprint(tenant: string, storeId: string, fingerprint: string) {
  const paymentLink = await PaymentLinkRepository.repo<PaymentLinkRepository>(tenant).findOne({ fingerprint })
  const cart = await CartRepository.repo().findOne({
    where: { _id: new ObjectID(paymentLink?.cartId), storeId },
  })

  if (!cart || !paymentLink) {
    return {
      message: 'Link not found',
    }
  }

  if (new Date() > new Date(addDays(new Date(paymentLink.createdAt), 1))) {
    await CartRepository.repo().deleteOne({ _id: new ObjectID(paymentLink?.cartId) })
    await PaymentLinkRepository.repo<PaymentLinkRepository>(tenant).deleteOne({ fingerprint })
    return {
      message: 'Expired',
    }
  }
  return {
    cart,
    deliveryFee: paymentLink.deliveryFee,
  }
}
