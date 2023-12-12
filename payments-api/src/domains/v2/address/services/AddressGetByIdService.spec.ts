import { Address, ObjectID } from '@mypharma/api-core'
import FakeAddressRepository from '../../../../repositories/FakeRepository/FakeAddressRepository'
import AddressGetByIdService from './AddressGetByIdService'

describe('Testing Address services', () => {
  let mockAddress = new Address()
  const tenant = ''
  const AddressRepository = new FakeAddressRepository()

  beforeAll(async () => {
    mockAddress._id = new ObjectID(32) as any
    mockAddress.isMain = true
    mockAddress.number = 1000
    mockAddress.street = 'Rua test'
    mockAddress.neighborhood = null
    mockAddress.createdAt = new Date()

    mockAddress = await AddressRepository.createDoc(mockAddress)
  })

  test('Should be able find Address by _id', async () => {
    const addressGetByIdService = new AddressGetByIdService(AddressRepository)
    const addressId = mockAddress._id.toString()

    const address = await addressGetByIdService.findAddressById({ tenant, addressId, deliveryMode: 'own_delivery' })

    expect(address).toBeInstanceOf(Address)
  })

  test('Should be able not find Address by _id when deliveryMode is own_delivery', async () => {
    const addressGetByIdService = new AddressGetByIdService(AddressRepository)
    const addressId = '12345'

    expect(
      addressGetByIdService.findAddressById({
        tenant,
        addressId,
        deliveryMode: 'own_delivery',
      })
    ).rejects.toBeInstanceOf(Error)
  })
})
