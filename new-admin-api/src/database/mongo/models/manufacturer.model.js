// MongoDB Schema
const { Schema, Types } = require('mongoose')

// Base model
const BaseModel = require('./internals/model-base')

class Manufacturer extends BaseModel {
  constructor() {
    super()

    // Schema name
    this.schemaName = 'manufacturer'

    this.softDelete = true 
    
    // Definition
    this.schemaDefinition = new Schema({
      originalId: Number,
      name: String,
      image: String,
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

module.exports = new Manufacturer()
