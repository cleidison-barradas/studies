// MongoDB Schema
const { Schema } = require('mongoose')
// Base model
const BaseModel = require('./internals/model-base')

class ShowCase extends BaseModel {
  constructor() {
    super()

    // Schema name
    this.schemaName = 'productspecial'

    // Definition
    this.schemaDefinition = new Schema({
      originalId: String,
      price: Number,
      date_start: {
        default: Date.now,
        type: Date,
      },
      date_end: {
        default: Date.now,
        type: Date,
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

module.exports = new ShowCase()
