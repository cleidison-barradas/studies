const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class PagseguroOrder extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'pagseguroOrder'

    this.schemaDefinition = new Schema({
      order: Object,

      status: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7],
        default: 1,
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

module.exports = new PagseguroOrder()
