const { normalizePaymentCode } = require('../utils/normalize-mongo-orders')

describe('normalizePaymentCode', () => {
    test('should return the correct text for payment on pickup', () => {
      const paymentCode = 'pay_on_delivery'
      const deliveryMode = 'store_pickup'
      const expectedPaymentCodeText = 'Pagamento na retirada'
  
      const result = normalizePaymentCode(paymentCode, deliveryMode)
  
      expect(result).toBe(expectedPaymentCodeText)
    })
  
    test('should return the correct text for payment on delivery', () => {
      const paymentCode = 'pay_on_delivery'
      const deliveryMode = ''
      const expectedPaymentCodeText = 'Pagamento na entrega'
  
      const result = normalizePaymentCode(paymentCode, deliveryMode)
  
      expect(result).toBe(expectedPaymentCodeText)
    })
  
    test('should return the correct text for online payment', () => {
      const paymentCode = 'pay_online'
      const deliveryMode = ''
      const expectedPaymentCodeText = 'Pagamento online'
  
      const result = normalizePaymentCode(paymentCode, deliveryMode)
  
      expect(result).toBe(expectedPaymentCodeText)
    })
  
    test('should return an empty string for other cases', () => {
      const paymentCode = ''
      const deliveryMode = ''
      const expectedPaymentCodeText = ''
  
      const result = normalizePaymentCode(paymentCode, deliveryMode)
  
      expect(result).toBe(expectedPaymentCodeText)
    })
  })