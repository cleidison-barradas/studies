// MongoDB Schema
const { Schema } = require('mongoose')

// Base model
const BaseModel = require('./internals/model-base')

class Category extends BaseModel {
  constructor() {
    super()
    // Schema name
    this.schemaName = 'category'
    // Definition
    this.schemaDefinition = new Schema({
      originalId: Number,
      parentId: String,
      name: String,
      parentId: String,
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
      },
      position : {
        type : Number,
        default : null
      }
    })

    // Schema configuration
    this._configureSchema()
  }
}

module.exports = new Category()
