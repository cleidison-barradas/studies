// MongoDB Schema
const { Schema } = require('mongoose')

// Base model
const BaseModel = require('./internals/model-base')

class paymentOptions extends BaseModel {
  constructor() {
    super()
    this.schemaName = 'paymentoptions'

    this.schemaDefinition = new Schema({
      name: String,
      type: {
        type: String,
        enum: ['debit','credit', 'covenant','money', 'gateway'],
        required: true
      },
      updatedAt: {
        type: Date,
        default: Date.now
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      active: Boolean
    })

    // Schema configuration
    this._configureSchema()
  }
}

module.exports = new paymentOptions()
