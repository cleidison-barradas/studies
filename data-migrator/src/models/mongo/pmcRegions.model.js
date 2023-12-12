const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class PmcRegions extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'pmcregions'

    this.schemaDefinition = new Schema({
      originalId: Number,
      productEanValue: [
        {
          product_ean: Number,
          pmc_value: Number
        }
      ],
      name: String,
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

module.exports = new PmcRegions()
