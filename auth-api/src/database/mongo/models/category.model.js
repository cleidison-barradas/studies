// MongoDB Schema
const { Schema, Types } = require('mongoose')

// Base model
const BaseModel = require('./internals/model-base')

class Category extends BaseModel {
  constructor() {
    super()

    // Schema name
    this.schemaName = 'category'

    this.softDelete = true 
    
    // Definition
    this.schemaDefinition = new Schema({
      originalId: Number,
      name: String,
      description: String,
      metaTitle: String,
      metaDescription : String,
      image: String,
      primary : {
        type : Boolean,
        default : true
      },
      sort: {
        type: Number,
        default: null,
      },
      status: {
        type: Boolean,
        default: true
      },
      subCategories: Array,
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

module.exports = new Category()
