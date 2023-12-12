// MongoDB Schema
const { Schema, Types } = require('mongoose')

// Base model
const BaseModel = require('./internals/model-base')

class NotificationCustomer extends BaseModel {
  constructor() {
    super()
    this.schemaName = 'notificationcustomer'

    this.schemaDefinition = new Schema({
      message: String,
      subject: String,
      storeId: {
        type: Types.ObjectId
      },
      sendAt: {
        type: Date,
      },
      process: {
        type: String,
        enum: ['pending', 'sending', 'failure', 'sent'],
        default: 'pending'
      },
      target: {
        type: String,
        enum: ['customers', 'orders'],
      },
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

module.exports = new NotificationCustomer()
