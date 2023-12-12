const { Schema } = require('mongoose')
const BaseModel = require('./internals/model-base')

class Neighborhood extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'neighborhood'
    this.softDelete = true

    this.schemaDefinition = new Schema({
      name: String,
      originalId: {
        type: Number,
      },
      originalCityId: Number,
      city: {
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

module.exports = new Neighborhood()
