const { ObjectID } = require('bson')
const { getModelByTenant } = require('myp-admin/database/mongo')
const {
  Models: { PaymentOptionSchema, InstallmentsDetailsSchema },
} = require('myp-admin/database/mongo')

const OptionSchema = PaymentOptionSchema.Model()

const DefaultStoneCardsFlagFee = require('./cardsData/defaultStoneCardsFlagFee')

class GatewayService {
  async getAll(tenant) {
    const PaymentMethod = getModelByTenant(tenant, 'PaymentMethodSchema')

    return await PaymentMethod.find({})
  }

  async getById(id, tenant) {
    const PaymentMethod = getModelByTenant(tenant, 'PaymentMethodSchema')

    const _id = new ObjectID(id)

    return await PaymentMethod.find({ _id })
  }

  async changeActiveGateway(optionName, tenant) {
    const PaymentMethod = getModelByTenant(tenant, 'PaymentMethodSchema')
    const hasActiveBefore = await PaymentMethod.findOne({ active: true })

    // Deactivate actual gateway
    if (hasActiveBefore && (optionName === 'Pagseguro' || optionName === 'Stone')) {
      await PaymentMethod.updateOne({ active: true }, { $set: { active: false } })
    }
  }

  async update(methodPayment, tenant) {
    const PaymentMethod = getModelByTenant(tenant, 'PaymentMethodSchema')

    const { _id, extras } = methodPayment
    let { paymentOption, installmentsDetails, updatedBy = {} } = methodPayment

    if (!paymentOption) {
      paymentOption = await OptionSchema.create(paymentOption)
    }

    const optionName = paymentOption.name

    if (installmentsDetails) {
      const {
        maxInstallments,
        minValueToInstallments,
        applyInstallmentsFee,
        applyInstallmentsFeeFrom,
        manualFee,
        cardsFlagFee,
        minValueToInstallmentsFlag
      } = methodPayment.installmentsDetails

      await PaymentMethod.updateOne({ _id: methodPayment._id }, {
        $set: {
          'installmentsDetails.maxInstallments': maxInstallments,
          'installmentsDetails.minValueToInstallments': minValueToInstallmentsFlag ? minValueToInstallments : 0,
          'installmentsDetails.applyInstallmentsFee': applyInstallmentsFee ?? false,
          'installmentsDetails.applyInstallmentsFeeFrom': applyInstallmentsFeeFrom ?? 1,
          'installmentsDetails.manualFee': manualFee ?? false,
          'installmentsDetails.cardsFlagFee': (cardsFlagFee && optionName === 'Stone') ? cardsFlagFee : DefaultStoneCardsFlagFee,
          updatedAt: new Date(),
        }
      })
    }

    const active = true

    await PaymentMethod.updateOne({ _id }, {
      paymentOption,
      extras,
      active,
      updatedBy
    })

    return await PaymentMethod.findOne({
      _id,
      active: true,
    })
  }

  async methodExists(paymentMethod, tenant) {
    const PaymentMethod = getModelByTenant(tenant, 'PaymentMethodSchema')
    const { _id } = paymentMethod

    if (!_id) {
      return false
    }
    const method = await PaymentMethod.findOne({ _id })

    return method
  }

  async create(paymentMethod, tenant) {
    const PaymentMethod = getModelByTenant(tenant, 'PaymentMethodSchema')
    const InstallmentDetailsSchema = InstallmentsDetailsSchema.Model()

    let { extras, paymentOption, installmentsDetails, updatedBy = {} } = paymentMethod

    if (!paymentOption) {
      paymentOption = await OptionSchema.create(paymentOption)
    }

    if (installmentsDetails) {
      installmentsDetails = await InstallmentDetailsSchema.create(installmentsDetails)
    }

    const newGatewayMethod = PaymentMethod.create({
      installmentsDetails,
      paymentOption,
      extras,
      active: true,
      updatedBy,
    })

    return newGatewayMethod
  }

  async createStoneInstallmentsDetails(paymentMethod, tenant) {
    const PaymentMethod = getModelByTenant(tenant, 'PaymentMethodSchema')
    const InstallmentDetailsSchema = InstallmentsDetailsSchema.Model()

    let { _id, installmentsDetails } = paymentMethod

    if (!installmentsDetails) {
      installmentsDetails = await InstallmentDetailsSchema.create({
        maxInstallments: 12,
        minValueToInstallments: 0,
        applyInstallmentsFee: false,
        applyInstallmentsFeeFrom: 0,
        manualFee: true,
        cardsFlagFee: DefaultStoneCardsFlagFee
      })
    }

    await PaymentMethod.updateOne({ _id }, {
      installmentsDetails
    })
  }
}

module.exports = GatewayService
