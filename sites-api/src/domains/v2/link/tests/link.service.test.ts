import { PaymentLinkRepository, CartRepository, ObjectID } from './__mocks__/api_core'
import { cart } from './__mocks__/__data__/carts'

jest.mock('@mypharma/api-core', () => ({
  PaymentLinkRepository,
  CartRepository,
  ObjectID,
}))

import { getPaymentLinkByFingerprint } from '../link.service'

describe('PaymentlinkService', () => {
  describe('getPaymentLinkByFingerprint', () => {
    const tenant = 'test'
    const storeId = 'test'

    it('should return a payment link by valid payment link fingerprint', async () => {
      const fingerprint = 'test'
      const paymentLink = await getPaymentLinkByFingerprint(tenant, storeId, fingerprint)
      expect(paymentLink).toMatchObject({
        cart,
        deliveryFee: paymentLink.deliveryFee,
      })
    })

    it('should return a response to a expired payment link', async () => {
      const fingerprint = 'test_expired'
      const paymentLink = await getPaymentLinkByFingerprint(tenant, storeId, fingerprint)
      expect(paymentLink).toMatchObject({
        message: 'Expired',
      })
    })

    it('should return a response to an invalid payment link', async () => {
      const fingerprint = 'test_id_invalid'
      const paymentLink = await getPaymentLinkByFingerprint(tenant, storeId, fingerprint)

      expect(paymentLink).toMatchObject({
        message: 'Link not found',
      })
    })
  })
})
