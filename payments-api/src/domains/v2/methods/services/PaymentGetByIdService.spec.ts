import { ObjectID, PaymentMethod } from "@mypharma/api-core"
import PaymentGetByIdService from './PaymentGetByIdService'
import FakePaymentMethodRepository from '../../../../repositories/FakeRepository/FakePaymentMethodRepository'

describe('Testing payment methods services', () => {
  let mockPaymentMethod = new PaymentMethod()
  const fakePaymentMethodRepository = new FakePaymentMethodRepository()
  const paymentGetByIdService = new PaymentGetByIdService(fakePaymentMethodRepository)
  const tenant = ''

  beforeAll(async () => {
    mockPaymentMethod._id = new ObjectID(32) as any
    mockPaymentMethod.extras = []
    mockPaymentMethod.createdAt = new Date()

    mockPaymentMethod = await fakePaymentMethodRepository.createDoc(mockPaymentMethod)
  })

  test('Should be able to find payment method by _id', async () => {
    const paymentId = mockPaymentMethod._id.toString()

    const paymentMethod = await paymentGetByIdService.findPaymentMethodById({ tenant, paymentId })

    expect(paymentMethod).toBeInstanceOf(PaymentMethod)
  })

  test('Should be able not find payment method by _id', async () => {
    const paymentId = ''

    expect(paymentGetByIdService.findPaymentMethodById({
      tenant,
      paymentId
    })).rejects.toBeInstanceOf(Error)

  })

})