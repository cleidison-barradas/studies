const { Schema, Types } = require('mongoose')

const BaseModel = require('./internals/model-base')

class ProductDescription extends BaseModel {
  constructor() {
    super()
    this.schemaName = 'productDescription'

    this.schemaDefinition = new Schema({
      metaTitle: {
        type: String,
        default: null,
      },
      metaDescription: {
        type: String,
        default: null,
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

module.exports = new ProductDescription()
