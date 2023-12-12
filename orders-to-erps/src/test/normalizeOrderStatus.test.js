const { normalizeOrderStatus } = require('../utils/normalize-mongo-orders')

describe('normalizeOrderStatus', () => {
    test('should return null when status is not provided', () => {
      const status = null
      const result = normalizeOrderStatus(status)
      expect(result).toBeNull()
    })
  
    test('should normalize order status correctly', () => {
      const status = {
        originalId: '123',
        name: 'Pending'
      }
      const result = normalizeOrderStatus(status)
      expect(result).toEqual({
        order_status_id: '123',
        name: 'Pending'
      })
    })
  })
  