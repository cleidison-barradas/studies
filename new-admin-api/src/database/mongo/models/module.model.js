const { Schema } = require('mongoose')
const BaseModel = require('./internals/model-base')

class Module extends BaseModel {
  constructor() {
    super()

    // Schema name
    this.schemaName = 'module'

    // Definition
    this.schemaDefinition = new Schema({
      name: String,
      extras: Object,
      baseUrl: String,
      imageUrl: String,
      description: String,
      type: {
        type: String,
        enum: ['gateway', 'api', 'service'],
        default: 'api'
      },
      code: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
      },
      status: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    })

    // Schema configuration
    this._configureSchema()
  }
}

module.exports = new Module()
