const {normalizePayment} = require('../utils/normalize-mongo-orders')

describe('normalizePayment', () => {
    test('should return payment details for the iFood platform', () => {
      const payment = null
      const healthInsurance = 'Unspecified Company Name'
      const platform = 'iFood'
      const result = normalizePayment(payment, healthInsurance, platform)
      expect(result).toEqual({
        name: 'Pago pela plataforma Ifood',
        type: 'ifood'
      })
    })
  
    test('should return null when payment is not provided', () => {
      const payment = null
      const healthInsurance = 'Unspecified Company Name'
      const platform = 'ecommerce'
      const result = normalizePayment(payment, healthInsurance, platform)
      expect(result).toBeNull()
    })
  
    test('should correctly normalize payment details', () => {
      const payment = {
        paymentOption: {
          name: 'Credit Card',
          type: 'credit_card'
        },
        details: {
          payment_installments: 3
        }
      }
      const healthInsurance = 'Company Name'
      const platform = 'ecommerce'
      const result = normalizePayment(payment, healthInsurance, platform)
      expect(result).toEqual({
        name: 'Credit Card',
        type: 'credit_card',
        installments: 3
      })
    })
  
    test('should correctly normalize health insurance payment', () => {
      const payment = {
        paymentOption: {
          name: 'Health Insurance',
          type: 'covenant'
        },
        details: {
          payment_installments: 2
        }
      }
      const healthInsurance = 'Company Name'
      const platform = 'ecommerce'
      const result = normalizePayment(payment, healthInsurance, platform)
      expect(result).toEqual({
        name: 'Company Name',
        type: 'covenant',
        installments: 2
      })
    })
  })
  