const {
  paymentMethod,
  updatedPaymentMethod,
  paymentMethodList
} = require('../_data_/paymentMethods.data.js')

const { installmentsDetails } = require('../_data_/installmentsDetails.data.js')
const { paymentOption } = require('../_data_/paymentOption.data.js')

function getModelByTenant(tenant, modelName) {
  let mockedModule = null

  if (modelName === 'PaymentMethodSchema') {
    mockedModule = {
      find: jest.fn((_filter) => {

        if (_filter === "{ 'paymentOption.type': 'gateway' }") {
          return paymentMethodList
        }

        if (_filter._id) {
          return paymentMethodList[0]
        }
        return paymentMethodList
      }),
      create: jest.fn((_paymentMethod) => {
        return paymentMethod
      }),
      updateOne: jest.fn((_filter, _paymentMethod) => {
        // return updatedPaymentMethod
      }),
      findOne: jest.fn((_filter) => {
        return updatedPaymentMethod
      }),
    }
    return mockedModule
  }
}

const PaymentOptionSchemaModel = {
  Model: () => ({
    create: jest.fn((_paymentOption) => {
      return paymentOption
    })
  })
}

const InstallmentDetailsSchemaModel = {
  Model: () => ({
    create: jest.fn((_installmentsDetails) => {
      return installmentsDetails
    })
  })
}

module.exports = {
  getModelByTenant,
  Models: {
    PaymentOptionSchema: PaymentOptionSchemaModel,
    InstallmentsDetailsSchema: InstallmentDetailsSchemaModel
  }
}
