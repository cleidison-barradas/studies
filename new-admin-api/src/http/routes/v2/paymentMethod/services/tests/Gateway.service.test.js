const GatewayService = require('../Gateway.service')

const {
  paymentMethod,
  updatedPaymentMethod,
  paymentMethodList
} = require('./mock/_data_/paymentMethods.data.js')

jest.mock('myp-admin/database', () => require('./mock/db'))

jest.mock('myp-admin/database/mongo', () => require('./mock/db'))

describe('Gateways Service', () => {
  describe('Get Gateway Methods', () => {
    test('Should return all Gateway Methods', async () => {
      const gatewayService = new GatewayService()

      const result = await gatewayService.getAll()

      expect(result).toMatchObject(paymentMethodList)
    })

    test('Should return a GatewayMethod by Id', async () => {
      const gatewayService = new GatewayService()

      const result = await gatewayService.getById(paymentMethod._id)

      expect(result).toMatchObject(paymentMethod)
    })
  })

  describe('Update Gateway Methods', () => {
    test('Update a Gateway Method', async () => {
      const gatewayService = new GatewayService()

      const toUpdatePaymentMethod = paymentMethod

      toUpdatePaymentMethod.installmentsDetails.minValueToInstallmentsFlag = false

      const result = await gatewayService.update(toUpdatePaymentMethod)

      expect(result).toMatchObject(updatedPaymentMethod)
    })
  })

  describe('Create Gateway Methods', () => {
    test('Create a Gateway Method', async () => {
      const gatewayService = new GatewayService()

      const result = await gatewayService.create(paymentMethod)

      expect(result).toMatchObject(paymentMethod)
    })
  })
})
