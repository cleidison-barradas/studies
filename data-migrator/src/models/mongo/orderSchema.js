const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class Order extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'order'
    this.softDelete = true

    this.schemaDefinition = new Schema({
      originalId: Number,
      originalCustomerId: Number,
      originalStatusId: Number,
      prefix: String,
      comment: String,
      clientIP: String,
      userAgent: String,
      products: [
        {
          product: {
            type: Object
          },
          name: {
            type: String
          },
          unitaryValue: {
            type: Number
          },
          promotionalPrice: {
            type: Number
          },
          amount: {
            type: Number
          },
        }
      ],
      totalOrder: Number,
      deliveryData: {
        type: Object,
        default: null
      },
      statusOrder: {
        type: Object,
        default: null
      },
      customer: {
        type: Object,
        default: null
      },
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

module.exports = new Order()
