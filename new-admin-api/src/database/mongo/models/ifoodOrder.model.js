const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class IFoodOrder extends BaseModel {
  constructor() {
    super()
    this.schemaName = 'ifoodOrder'

    this.schemaDefinition = new Schema({
      ifoodCode: String,
      ifoodId: String,
      price: Number,
      status: String,
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

module.exports = new IFoodOrder()
