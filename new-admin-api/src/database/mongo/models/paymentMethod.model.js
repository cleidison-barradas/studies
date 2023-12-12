const { Schema, Types } = require('mongoose')

const BaseModel = require('./internals/model-base')

class PaymentMethods extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'paymentMethods'

    this.schemaDefinition = new Schema({

      extras: {
        type: Array,
        default: [],
      },
      paymentOption: Object,
      details: Object,
      installmentsDetails: Object,
      updatedAt: {
        type: Date,
        default: Date.now
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedBy: {
        type: Object,
        required: false,
      },
      active: Boolean
    })

    this._configureSchema()
  }
}

module.exports = new PaymentMethods()
