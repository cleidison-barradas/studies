const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class Store extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'country'

    this.schemaDefinition = new Schema({
      originalId: {
        type: Number,
        require: true,
      },
      name: {
        type: String,
        require: true,
      },
      iso_code_2: {
        type: String,
        default: null
      },
      iso_code_3: {
        type: String,
        default: null
      },
      status: {
        type: Boolean,
        default: true
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
