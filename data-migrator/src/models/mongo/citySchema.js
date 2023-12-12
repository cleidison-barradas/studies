const { Schema, Types } = require('mongoose')
const BaseModel = require('./internals/model-base')

class City extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'city'
    this.softDelete = true

    this.schemaDefinition = new Schema({
      name: String,
      originalId: {
        type: Number,
      },
      originalStateId: Number,
      state: {
        type: Object,
        default: null
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

    this._configureSchema()
  }
}

module.exports = new City()
