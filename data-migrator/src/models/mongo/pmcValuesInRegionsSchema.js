const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class PmcValueRegions extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'pmcValueInRegions'

    this.softDelete = true

    this.schemaDefinition = new Schema({
      originalId: Number,
      productEan: String,
      value: Number,
      updatedAt: {
        type: Date,
        default: Date.now
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    })

    this._configureSchema()
  }
}

module.exports = new PmcValueRegions()
