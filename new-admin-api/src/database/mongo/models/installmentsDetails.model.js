// MongoDB Schema
const { Schema } = require('mongoose')

// Base model
const BaseModel = require('./internals/model-base')

class InstallmentsDetails extends BaseModel {
  constructor() {
    super()
    this.schemaName = 'installmentsDetails'

    this.schemaDefinition = new Schema({
      maxInstallments: {
        type: Number,
        default: 12
      },

      minValueToInstallments: {
        type: Number,
        default: 0
      },

      applyInstallmentsFee: {
        type: Boolean,
        default: false
      },

      applyInstallmentsFeeFrom: Number,

      manualFee: {
        type: Boolean,
        default: true
      },

      cardsFlagFee: Object,

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

module.exports = new InstallmentsDetails()
