const { normalizeCustomer } = require('../utils/normalize-mongo-orders')
describe('normalizeCustomer', () => {
    test('should return null when customer is not provided', () => {
      const customer = null
      const cpf = '1234567890'
      const result = normalizeCustomer(customer, cpf)
      expect(result).toBeNull()
    })
  
    test('should normalize customer fields correctly', () => {
      const customer = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        addresses: [
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
      }
      const cpf = '1234567890'
      const result = normalizeCustomer(customer, cpf)
      expect(result.firstname).toBe('John')
      expect(result.lastname).toBe('Doe')
      expect(result.email).toBe('john.doe@example.com')
      expect(result.telephone).toBe('123456789')
      expect(result.cpf).toBe('1234567890')
      expect(result.address).toEqual({
        shipping_address_1: 'Street Name',
        shipping_complement: 'Complement',
        shipping_address_2: 'Neighborhood Name',
        shipping_city: 'City Name',
        shipping_number: '123',
        shipping_postcode: '12345678',
        shipping_zone: 'State Name',
        shipping_country: 'Country Name',
        withdraw_in_store: false
      })
    })
  })
  