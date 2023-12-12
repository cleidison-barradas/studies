const { Schema } = require('mongoose')
const BaseModel = require('./internals/model-base')

class Cupom extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'cupom'

    this.schemaDefinition = new Schema({
      name: {
        required: true,
        type: String,
        unique: true,
      },
      status: {
        type: Boolean,
        default: true,
      },
      code: {
        type: String,
        required: true,
        unique: true,
      },
      initialDate: Date,
      finalDate: Date,
      amount: Number,
      minimumPrice: {
        type: Number,
        default: 0.0,
      },
      descountPercentage: Number,
      type: {
        type: String,
        enum: ['PRODUCT', 'DELIVERY', 'CATEGORY'],
        required: true,
      },
      timesUsed: {
        type: Number,
        default: 0,
      },
      descountCategorys: Array,
      products: Array,
      productBlacklist: {
        type: Array,
        default: [],
      },
      allProducts: {
        type: Boolean,
        default: false,
      },
      descountOnProduct: Number,
      descountOnDelivery: Number,
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

module.exports = new Cupom()
