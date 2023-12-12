const { Schema, Types } = require('mongoose');
const BaseModel = require('./internals/model-base');

class Remarketing extends BaseModel {
  constructor() {
    super()
    this.schemaName = 'remarketing'
 
    this.schemaDefinition = new Schema({
      channel: {
        type: String,
        enum: ['EMAIL', 'SMS']
      },
      type: {
        type: String,
        enum: ['CART-RECENT', 'MISS-YOU']
      },
      status: {
        type: String,
        enum: ['SENDING', 'PENDING', 'SENT']
      },
      products: {
        type: Array
      },
      store: Object,
      customer: Object,
      interval: Number,
      dynamicContent: Object,
      sendAt: {
        type: Date,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    });

    this._configureSchema();
  }
}

module.exports = new Remarketing();
