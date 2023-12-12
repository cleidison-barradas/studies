const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class Address extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'address'
    this.softDelete = true

    this.schemaDefinition = new Schema({
      originalId: {
        type: Number,
      },
      street: String,
      number: {
        type: String,
        default: 'Sem numero'
      },
      complement: String,
      originalCustomerId: Number,
      originalNeighborhoodId: Number,
      notDeliverable: {
        type: Boolean,
        default: false
      },
      postcode: {
        type: String,
        default: '00.000.000'
      },
      neighborhood: {
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

module.exports = new Address()
