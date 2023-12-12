const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class ImportHistory extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'importhistory'

    this.schemaDefinition = new Schema({
      total: Number,
      title: String,
      logs: Object,
      processed: Number,
      failures: Number,
      importData: [
        {
          EAN: String,
          name: String,
          quantity: String,
          presentation: String,
          price: String,
          message: {
            type: String,
            enum: ['product_not_found', 'invalid_stock', 'invalid_product', 'invalid_price']
          },
          action: {
            type: String,
            enum: ['add', 'undo']
          }
        }
      ],
      module: {
        type: String,
        enum: ['product', 'promotion', 'default']
      },
      status: {
        type: String,
        enum: ['finished', 'pending', 'failure'],
        default: 'pending'
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

module.exports = new ImportHistory()
