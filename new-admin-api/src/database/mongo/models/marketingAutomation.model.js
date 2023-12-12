// MongoDB Schema
const { Schema, Types } = require('mongoose')

// Base model
const BaseModel = require('./internals/model-base')

class MarketingAutomation extends BaseModel {
  constructor() {
    super()
    // Schema name
    this.schemaName = 'marketingautomation'

    // Definition
    this.schemaDefinition = new Schema({

      status: {
        type: Boolean,
        default: false
      },
      MISS_YOU: [
        {
          interval: Number,
          active: Boolean
        }
      ],

      RECENT_CART: {
        type: Boolean,
      },
      target: {
        type: String,
        enum: ['customers', 'orders'],
        default: 'customers'
      },
      message: String,
      subject: String,

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

module.exports = new MarketingAutomation()
