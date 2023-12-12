// MongoDB Schema
const { Schema } = require('mongoose')

// Base model
const BaseModel = require('./internals/model-base')

class PaymentDetails extends BaseModel {
  constructor() {
    super()
    this.schemaName = 'details'

    this.schemaDefinition = new Schema({
      payment_type: String,
      payment_method: String,
      payment_installments: Number,
      payment_maxInstallments: Number,
      payment_quota: Number,
      payment_additional_info: String,
      payment_interest: Number,
      external: Boolean,
      externalId: String,
      updatedAt: {
        type: Date,
        default: Date.now
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
    })

    // Schema configuration
    this._configureSchema()
  }
}

module.exports = new PaymentDetails()
