const { parseAddress } = require('../TrierService.js')

describe('parseAddress', () => {
  it('should parse the address correctly', () => {
    const address = {
      street: 'Main Street',
      number: '123',
      complement: 'Apt 4B',
      postcode: '12345-678',
      neighborhood: {
        name: 'Central District',
        city: {
          name: 'Metropolis',
          state: {
            code: 'ST',
          },
        },
      },
    }

    const storeCep = '98765-432'

    const expectedParsedAddress = {
      logradouro: 'Main Street',
      numero: '123',
      complemento: 'Apt 4B',
      referencia: '',
      bairro: 'Central District',
      cidade: 'Metropolis',
      estado: 'ST',
      cep: '12345678',
    }

    const parsedAddress = parseAddress(address, storeCep);
    expect(parsedAddress).toEqual(expectedParsedAddress);
  })

  it('should parse the address with missing fields', () => {
    const address = {}

    const storeCep = '98765-432'

    const expectedParsedAddress = {
      logradouro: '',
      numero: 'S/',
      complemento: '',
      referencia: '',
      bairro: '',
      cidade: '',
      estado: 'NI',
      cep: '98765432',
    }

    const parsedAddress = parseAddress(address, storeCep)
    expect(parsedAddress).toEqual(expectedParsedAddress)
  })
})
