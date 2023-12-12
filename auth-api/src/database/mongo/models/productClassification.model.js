// MongoDB Schema
const { Schema, Types } = require('mongoose')

// Base model
const BaseModel = require('./internals/model-base')

class ProductClassification extends BaseModel {
  constructor() {
    super()

    // Schema name
    this.schemaName = 'productClassification'

    this.softDelete = true 
    
    // Definition
    this.schemaDefinition = new Schema({
      name: String,
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

module.exports = new ProductClassification()
