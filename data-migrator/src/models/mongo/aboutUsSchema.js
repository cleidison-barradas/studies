const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class Store extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'aboutUs'
    this.softDelete = true

    this.schemaDefinition = new Schema({
      originalId: {
        type: Number,
      },
      content: {
        type: String,
        require: true,
      },
      status: {
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

module.exports = new Store()
