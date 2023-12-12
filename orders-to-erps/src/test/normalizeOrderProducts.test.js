const { normalizeOrderProducts } = require('../utils/normalize-mongo-orders')

describe('normalizeOrderProducts', () => {
    test('should return an empty array when products array is empty', () => {
      const products = []
      const result = normalizeOrderProducts(products)
      expect(result).toEqual([])
    })
  
    test('should normalize order products correctly', () => {
      const products = [
        {
          product: {
            name: 'Product 1',
            EAN: '1234567890',
            MS: 'MS123',
            sku: 'SKU123'
          },
          unitaryValue: '10.99',
          promotionalPrice: '9.99',
          amount: 2
        },
        {
          product: {
            name: 'Product 2',
            EAN: '0987654321'
          },
          unitaryValue: '5.99',
          amount: 3
        }
      ]
      const result = normalizeOrderProducts(products)
      expect(result).toEqual([
        {
          model: 'Product 1',
          quantity: 2,
          price: '9.99',
          total: '19.98',
          product: {
            ean: '1234567890',
            ms: 'MS123',
            sku: 'SKU123'
          }
        },
        {
          model: 'Product 2',
          quantity: 3,
          price: '5.99',
          total: '17.97',
          product: {
            ean: '0987654321',
            ms: null,
            sku: null
          }
        }
      ])
    })
  })