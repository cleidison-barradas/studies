const { Schema, Types } = require('mongoose')

const BaseModel = require('./internals/model-base')

class Category extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'category'
    this.softDelete = true

    this.schemaDefinition = new Schema({
      originalId: Number,
      parentId: {
        type: String,
        default: null
      },
      subCategories: [
        {
          type: Object,
          default: []
        }
      ],
      name: {
        type: String,
      },
      description: {
        type: String,
      },
      metaTitle: {
        type: String,
      },
      metaDescription: {
        type: String,
      },
      metaKeyWord: {
        type: String,
      },
      status: {
        type: Boolean,
        default: true,
      },
      cached: {
        type: Boolean,
        default: true,
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }

    })

    this._configureSchema()
  }
}

module.exports = new Category()
