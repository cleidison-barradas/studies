import { DeliveryFee, Neighborhood, ObjectID } from '@mypharma/api-core'
import FakeDeliveryFeeRepository from '../../../../repositories/FakeRepository/FakeDeliveryFeeRepository'
import DeliveryGetFeeByNeighborhoodIdService from './DeliveryGetFeeByNeighborhoodIdService'

describe('Testing deliveryFee services', () => {
  const tenant = ''
  let MockDeliveryFee = new DeliveryFee()
  let MockNeighborhood = new Neighborhood()
  const fakeDeliveryFeeRepository = new FakeDeliveryFeeRepository()
  const deliveryGetFeeByNeighborhoodIdService = new DeliveryGetFeeByNeighborhoodIdService(fakeDeliveryFeeRepository)

  beforeAll(async () => {
    MockNeighborhood.name = 'Bairro test'
    MockNeighborhood._id = new ObjectID(32) as any
    MockDeliveryFee._id = new ObjectID(32) as any
    MockDeliveryFee.feePrice = 10
    MockDeliveryFee.freeFrom = 0
    MockDeliveryFee.deliveryTime = 60
    MockDeliveryFee.minimumPurchase = 0
    MockDeliveryFee.neighborhood = MockNeighborhood

    MockDeliveryFee = await fakeDeliveryFeeRepository.createDoc(MockDeliveryFee)
  })

  test('Should be able to find deliveryFee by neighborhood _id', async () => {
    const neighborhoodId = MockNeighborhood._id.toString()

    const deliveryFee = await deliveryGetFeeByNeighborhoodIdService.getDeliveryFeeByNeighborhoodId({ tenant, neighborhoodId })

    expect(deliveryFee).toBeInstanceOf(DeliveryFee)
  })

  test('Should be able not find deliveryFee by neighborhood _id', async () => {
    const neighborhoodId = ''

    expect(deliveryGetFeeByNeighborhoodIdService.getDeliveryFeeByNeighborhoodId({
      tenant,
      neighborhoodId
    })).rejects.toBeInstanceOf(Error)

  })
})