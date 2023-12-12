const { Schema, Types } = require('mongoose')

const BaseModel = require('./internals/model-base')

class PaymentMethods extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'paymentMethods'

    this.softDelete = true 
    
    this.schemaDefinition = new Schema({
      name: {
        type:String,
        default: null,
      },
      paymentOption: Object,
      updatedAt: {
        type: Date,
        default: Date.now
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      active: {
        type: Boolean,
        default: false
      }
    })

    this._configureSchema()
  }
}

module.exports = new PaymentMethods()
