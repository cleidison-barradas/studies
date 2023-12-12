const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class OrderStatus extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'statusorder'

    this.schemaDefinition = new Schema({
      originalId: Number,
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ['accepted', 'pending', 'rejected', 'reversed', 'default', 'payment_made'],
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    })

    this._configureSchema()
  }

}

module.exports = new OrderStatus()
