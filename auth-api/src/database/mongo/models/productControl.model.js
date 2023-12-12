// MongoDB Schema
const { Schema, Types } = require('mongoose')

// Base model
const BaseModel = require('./internals/model-base')

class ProductControl extends BaseModel {
  constructor() {
    super()

    // Schema name
    this.schemaName = 'productControl'

    this.softDelete = true 
    
    // Definition
    this.schemaDefinition = new Schema({
      description: String,
      initials: String,
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

module.exports = new ProductControl()
