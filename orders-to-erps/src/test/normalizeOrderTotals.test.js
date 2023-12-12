const { normalizeOrderTotals } = require('../utils/normalize-mongo-orders')

describe('normalizeOrderTotals', () => {
    test('should return the order totals correctly when deliveryData is provided', () => {
      const deliveryData = {
        feePrice: 10.5
      }
      const total = 100
      const expectedOrderTotals = [
        {
          code: 'sub_total',
          title: 'Sub-total',
          value: 89.5,
        },
        {
          code: 'total',
          title: 'Total',
          value: 100,
        },
        {
          code: 'shipping',
          title: 'Frete',
          value: 10.5,
        },
      ]
  
      const result = normalizeOrderTotals(deliveryData, total)
  
      expect(result).toEqual(expectedOrderTotals)
    })
  
    test('should return the order totals correctly when deliveryData is null', () => {
      const deliveryData = null
      const total = 100
      const expectedOrderTotals = [
        {
          code: 'sub_total',
          title: 'Sub-total',
          value: 100,
        },
        {
          code: 'total',
          title: 'Total',
          value: 100,
        },
        {
          code: 'shipping',
          title: 'Frete',
          value: 0,
        },
      ]
  
      const result = normalizeOrderTotals(deliveryData, total)
  
      expect(result).toEqual(expectedOrderTotals)
    })
  })