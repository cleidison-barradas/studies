const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class Store extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'classification'

    this.schemaDefinition = new Schema({
      originalId: Number,
      name: {
        type: String,
        require: true,
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
