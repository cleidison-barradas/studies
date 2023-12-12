const {normalizeAddress} = require('../utils/normalize-mongo-orders')

describe('normalizeAddress', () => {
    test('should return withdraw_in_store as true when addresses array is empty', () => {
      const addresses = []
      const result = normalizeAddress(addresses)
      expect(result.withdraw_in_store).toBe(true)
    })
  
    test('should normalize address fields correctly', () => {
      const addresses = [
        {
          neighborhood: {
            name: 'Neighborhood Name',
            city: {
              name: 'City Name',
              state: {
                name: 'State Name',
                country: {
                  name: 'Country Name'
                }
              }
            }
          },
          street: 'Street Name',
          complement: 'Complement',
          postcode: '12345-678',
          number: '123'
        }
      ]
      const result = normalizeAddress(addresses)
      expect(result.shipping_address_1).toBe('Street Name')
      expect(result.shipping_complement).toBe('Complement')
      expect(result.shipping_address_2).toBe('Neighborhood Name')
      expect(result.shipping_city).toBe('City Name')
      expect(result.shipping_number).toBe('123')
      expect(result.shipping_postcode).toBe('12345678')
      expect(result.shipping_zone).toBe('State Name')
      expect(result.shipping_country).toBe('Country Name')
      expect(result.withdraw_in_store).toBe(false)
    })
  
    test('should set default values when address object is not valid', () => {
      const addresses = [null]
      const result = normalizeAddress(addresses)
      expect(result.shipping_address_1).toBe('')
      expect(result.shipping_complement).toBe('')
      expect(result.shipping_address_2).toBe('')
      expect(result.shipping_city).toBe('')
      expect(result.shipping_number).toBe('S/N')
      expect(result.shipping_postcode).toBe('')
      expect(result.shipping_zone).toBe('')
      expect(result.shipping_country).toBe('')
      expect(result.withdraw_in_store).toBe(true)
    })
  })
