const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class Order extends BaseModel {
  constructor() {
    super()
    this.schemaName = 'order'

    this.schemaDefinition = new Schema({
      cpf: String,
      tagCode: String,
      prefix: String,
      sequence: String,
      comment: String,
      clientIP: String,
      customer: Object,
      nfe_data: Object,
      externalId: String,
      totalOrder: Number,
      statusOrder: Object,
      trackingCode: String,
      deliveryData: Object,
      shippingData: Object,
      shippingOrder: Object,
      paymentMethod: Object,
      shippingAddress: Object,
      externalMarketplace: {
        name: String,
        externalId: String
      },
      healthInsurance: {
        type: Number,
        default: 0
      },
      products: [
        {
          product: Object,
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
      deliveryMode: {
        type: String,
        enum: ['store_pickup', 'own_delivery', 'delivery_company'],
        default: 'own_delivery'
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
