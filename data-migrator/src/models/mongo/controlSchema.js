const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class Store extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'control'

    this.schemaDefinition = new Schema({
      originalId: Number,
      description: {
        type: String,
        default: null
      },
      initials: {
        type: String,
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
