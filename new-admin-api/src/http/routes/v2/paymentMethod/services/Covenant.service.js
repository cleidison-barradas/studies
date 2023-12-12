const { getModelByTenant } = require('myp-admin/database/mongo')
const {
  Models: { PaymentOptionSchema, PaymentDetailsSchema },
} = require('myp-admin/database/mongo')

const OptionSchema = PaymentOptionSchema.Model()
const DetailsSchema = PaymentDetailsSchema.Model()

class CovenantMethodService {
  async get(tenant) {
    const PaymentMethod = getModelByTenant(tenant, 'PaymentMethodSchema')
    return await PaymentMethod.findOne({ 'paymentOption.type': 'covenant' })
  }

  async create(tenant, method) {
    let { details, paymentOption } = method
    const PaymentMethod = getModelByTenant(tenant, 'PaymentMethodSchema')

    if (paymentOption) paymentOption = await OptionSchema.create(paymentOption)

    if (details) details = await DetailsSchema.create(details)

    const covenantMethod = await PaymentMethod.create({
      details,
      paymentOption,
      extras: [],
    })
    return covenantMethod
  }

  async update(tenant, details, method) {
    const PaymentMethod = getModelByTenant(tenant, 'PaymentMethodSchema')

    const { _id } = method

    const {
      payment_maxInstallments,
      payment_applyInstallmentsFeeFrom,
      payment_fee,
      payment_minValueToInstallments
    } = method.details

    const {
      payment_maxInstallments: new_maxInstallments,
      payment_applyInstallmentsFeeFrom: new_freeFeeInstallments,
      payment_fee: new_installmentFee,
      payment_minValueToInstallments: new_minValueToInstallments
    } = details

    let newDetails = null

    if (
      new_maxInstallments !== payment_maxInstallments ||
      new_freeFeeInstallments !== payment_applyInstallmentsFeeFrom ||
      new_installmentFee !== payment_fee ||
      new_minValueToInstallments !== payment_minValueToInstallments
    ) {
      newDetails = await DetailsSchema.create(details)
    }

    if (newDetails !== null) {
      await PaymentMethod.updateOne({ _id }, { $set: { details: newDetails } })
    }

    return await this.get(tenant)
  }

  async delete(_id) {
    const PaymentMethod = getModelByTenant(tenant, 'PaymentMethodSchema')
    const deletedCovenantMethod = await PaymentMethod.findByIdAndDelete(_id).exec()

    return { deletedId: deletedCovenantMethod._id }
  }
}

module.exports = CovenantMethodService
