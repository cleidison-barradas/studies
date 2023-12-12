// MongoDB Schema
const { Schema } = require('mongoose')

// Base model
const BaseModel = require('./internals/model-base')

class ProductSlug extends BaseModel {
  constructor() {
    super()

    // Schema name
    this.schemaName = 'productSlug'

    this.softDelete = true

    // Definition
    this.schemaDefinition = new Schema({
      originalId: String,
      url: String,
      version: String,
      product : {
        type: Object,
        default: null
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

module.exports = new ProductSlug()
