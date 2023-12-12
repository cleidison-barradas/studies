const { Schema, Types } = require('mongoose')

const BaseModel = require('./internals/model-base')

class PicpayOrder extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'picpayOrder'

    this.schemaDefinition = new Schema({
      order: Object,

      status: {
        type: String,
        enum: ['created', 'expired', 'analysis', 'paid', 'completed', 'refunded', 'chargeback'],
        default: 'created',
        required: true
      },
      pagseguroId: {
        type: String
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

    this._configureSchema()

  }
}

module.exports = new PicpayOrder()
