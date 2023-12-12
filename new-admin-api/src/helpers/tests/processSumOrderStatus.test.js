const {processOrderStatus} = require('../processSumOrderStatus')

describe('processOrderStatus', () => {
    test('increments totalPending when status is "pending"', () => {
      const order = { statusOrder: { type: 'pending' }, totalOrder: 10 }
      const statusCounts = { totalPending: 0 }
      processOrderStatus(order, statusCounts)
      expect(statusCounts.totalPending).toBe(10)
    })

    test('increments totalAccepted when status is "accepted"', () => {
      const order = { statusOrder: { type: 'accepted' }, totalOrder: 10 }
      const statusCounts = { totalAccepted: 0 }
      processOrderStatus(order, statusCounts)
      expect(statusCounts.totalAccepted).toBe(10)
    })

    test('increments totalRejected when status is "rejected"', () => {
      const order = { statusOrder: { type: 'rejected' }, totalOrder: 10 }
      const statusCounts = { totalRejected: 0 }
      processOrderStatus(order, statusCounts)
      expect(statusCounts.totalRejected).toBe(10)
    })

    test('increments totalDelivery_made when status is "delivery_made"', () => {
      const order = { statusOrder: { type: 'delivery_made' }, totalOrder: 10 }
      const statusCounts = { totalDelivery_made: 0 }
      processOrderStatus(order, statusCounts)
      expect(statusCounts.totalDelivery_made).toBe(10)
    })

    test('increments totalReversed when status is "reversed"', () => {
      const order = { statusOrder: { type: 'reversed' }, totalOrder: 10 }
      const statusCounts = { totalReversed: 0 }
      processOrderStatus(order, statusCounts)
      expect(statusCounts.totalReversed).toBe(10)
    })

    test('increments totalOut_delivery when status is "out_delivery"', () => {
      const order = { statusOrder: { type: 'out_delivery' }, totalOrder: 10 }
      const statusCounts = { totalOut_delivery: 0 }
      processOrderStatus(order, statusCounts)
      expect(statusCounts.totalOut_delivery).toBe(10)
    })

    test('increments totalPayment_made when status is "payment_made"', () => {
      const order = { statusOrder: { type: 'payment_made' }, totalOrder: 10 }
      const statusCounts = { totalPayment_made: 0 }
      processOrderStatus(order, statusCounts)
      expect(statusCounts.totalPayment_made).toBe(10)
    })

    test('increments totalDefault for unknown status types', () => {
      const order = { statusOrder: { type: 'foo' }, totalOrder: 10 }
      const statusCounts = { totalDefault: 0 }
      processOrderStatus(order, statusCounts)
      expect(statusCounts.totalDefault).toBe(10)
    })
  })