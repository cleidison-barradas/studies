const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class Store extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'store'

    this.schemaDefinition = new Schema({
      originalId:Number,
      originalPmcId: Number,
      name: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        require: true,
      },
      tenant: {
        type: String,
        required: true,
      },
      settings: {
        type: Object,
        default: {}
      },
      pmc: {
        type: Object,
        default: null
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

module.exports = new Store()
