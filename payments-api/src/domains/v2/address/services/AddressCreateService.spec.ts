import AddressCreateService, { CityDTO, NeighborhoodDTO } from './AddressCreateService'
import { Address } from '@mypharma/api-core'

jest.mock('@mypharma/api-core', () => {
  return {
    AddressRepository: {
      repo: jest.fn().mockImplementation(() => {
        return {
          createDoc: jest.fn().mockImplementation((addressData) => {
            return {
              _id: '123',
              ...addressData,
            }
          }),
          deleteDoc: jest.fn(),
        }
      }),
    },
    CityRepository: {
      repo: jest.fn().mockImplementation(() => {
        return {
          findOne: jest.fn().mockImplementation((expression) => {
            if (expression.where.name.test('Sao Paulo')) return null
            return {
              _id: '123',
              ...expression,
            }
          }),
          save: jest.fn().mockImplementation((city) => {
            return {
              _id: '123',
              ...city,
            }
          }),
        }
      }),
    },
    NeighborhoodRepository: {
      repo: jest.fn().mockImplementation(() => {
        return {
          find: jest.fn().mockImplementation(() => {
            return [
              {
                _id: '123',
                name: 'Centro',
                city: {
                  name: 'Rio de Janeiro',
                  state: {
                    name: 'Rio de Janeiro',
                  },
                },
              },
            ]
          }),
          save: jest.fn().mockImplementation((neighborhood) => {
            return {
              _id: '123',
              ...neighborhood,
            }
          }),
        }
      }),
    },
    CustomerRepository: {
      repo: jest.fn().mockImplementation(() => {
        return {
          updateOne: jest.fn().mockImplementation(() => {
            return {
              _id: '123',
            }
          }),
          findOne: jest.fn().mockImplementation(() => {
            return {
              _id: '123',
            }
          }),
        }
      }),
    },
  }
})

describe('Testing Create Address Service', () => {
  // Setup
  const tenant = 'test-tenant'
  const addressData = {
    street: 'Av Brasil',
    number: 123,
    complement: 'apto 123',
    postcode: '12345-123',
    neighborhood: {
      name: 'Centro',
      city: {
        name: 'Rio de Janeiro',
        state: {
          name: 'Rio de Janeiro',
          code: 'RJ',
          country: {
            name: 'Brasil',
          },
        },
      },
    },
    isMain: false,
  }

  const cityData = {
    name: 'Rio de Janeiro',
    state: {
      name: 'Rio de Janeiro',
      code: 'RJ',
    },
  }

  test('Should be able to create new address', async () => {
    const service = new AddressCreateService()

    const addressDoc = await service.putAddress(tenant, addressData as Address)

    expect(addressDoc._id).toBeDefined()
    expect(addressDoc.street).toBe(addressData.street)
    expect(addressDoc.number).toBe(addressData.number)
    expect(addressDoc.complement).toBe(addressData.complement)
    expect(addressDoc.postcode).toBe(addressData.postcode)
    expect(addressDoc.neighborhood).toMatchObject(addressData.neighborhood)
  })

  test('Should be able to find city', async () => {
    const service = new AddressCreateService()

    const cityDoc = await service.findCity(cityData as CityDTO)

    expect(cityDoc._id).toBeDefined()
  })

  test("Should'nt be able to find city", async () => {
    const service = new AddressCreateService()

    const cityDoc = await service.findCity({ name: 'São Paulo', state: { name: 'São Paulo', code: 'SP' } } as CityDTO)

    expect(cityDoc).toBeNull()
  })

  test('Should be able to save city', async () => {
    const service = new AddressCreateService()

    const cityDoc = await service.saveCity(cityData as CityDTO)

    expect(cityDoc._id).toBeDefined()
  })

  test('Should be able to save neighborhood', async () => {
    const service = new AddressCreateService()

    const neighborhoodDoc = await service.saveNeighborhood({ name: 'Centro', city: cityData as CityDTO, deliverable: true } as NeighborhoodDTO)

    expect(neighborhoodDoc._id).toBeDefined()
  })

  test('Should be able to get neighborhood by name', async () => {
    const service = new AddressCreateService()

    const neighborhoodDoc = await service.getNeighborhoodByName({ name: 'Centro', city: cityData as CityDTO, deliverable: true } as NeighborhoodDTO)

    expect(neighborhoodDoc._id).toBeDefined()
  })

  test("Should'nt be able to get neighborhood by name", async () => {
    const service = new AddressCreateService()

    const neighborhoodDoc = await service.getNeighborhoodByName({ name: 'São Paulo', city: cityData as CityDTO, deliverable: true } as NeighborhoodDTO)

    expect(neighborhoodDoc).toBeNull()
  })

  test("Should be able to update customer's address", async () => {
    const service = new AddressCreateService()

    const customerDoc = await service.addCustomerAddress(tenant, 123 as any, addressData as Address)

    expect(customerDoc).toBeDefined()
  })
})
