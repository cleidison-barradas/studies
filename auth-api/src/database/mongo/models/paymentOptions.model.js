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
        enum: ['DEBIT','CREDIT', 'COVENANT','MONEY','ONLINE', 'GATEWAY'],
        required: true
      },
      extras: [],
      updatedAt: {
        type: Date,
        default: Date.now
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    })

    // Schema configuration
    this._configureSchema()
  }
}

module.exports = new paymentOptions()
