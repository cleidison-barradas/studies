const { Schema, Types } = require('mongoose')


const BaseModel = require('./internals/model-base')

class Order extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'order'

    this.softDelete = true

    this.schemaDefinition = new Schema({
      prefix: String,
      comment: String,
      clientIP: String,
      products: [
        {
          product:Object,
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
        deliveryFeeID: Object,
        deliveryFee: Number,
        deliveryTime: Number,
      },
      statusOrder: Object,
      customer: Object,
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
