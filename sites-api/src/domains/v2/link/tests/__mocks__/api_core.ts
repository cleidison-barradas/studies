import { paymentLink } from './__data__/paymentLinks'
import { cart } from './__data__/carts'
import { ObjectID as ObjectIDApiCore } from 'mongodb'
import { subHours } from 'date-fns'

export const PaymentLinkRepository = {
  repo: jest.fn().mockReturnValue({
    findOne: jest.fn(({ fingerprint }) => {
      if (fingerprint === 'test_expired') {
        const _paymentLink = {
          ...paymentLink,
          createdAt: new Date(subHours(new Date(), 26)),
        }
        return _paymentLink
      }
      if (fingerprint === 'test_id_invalid') {
        return null
      }

      // Valid fingerprint
      return {
        ...paymentLink,
        createdAt: new Date(subHours(new Date(), 1)),
      }
    }),
    deleteOne: jest.fn().mockReturnValue(paymentLink),
  }),
}

export const CartRepository = {
  repo: jest.fn().mockReturnValue({
    findOne: jest.fn(({ where: _id }) => {
      if (_id) {
        return cart
      }
      return null
    }),
    deleteOne: jest.fn().mockReturnValue(cart),
  }),
}

export const ObjectID = ObjectIDApiCore
