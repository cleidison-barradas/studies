const { Schema, Types } = require('mongoose');
const BaseModel = require('./internals/model-base');

class DeliveryFee extends BaseModel {
  constructor() {
    super();

    this.schemaName = 'deliveryFee';
    this.softDelete = true;

    this.schemaDefinition = new Schema({
      deliveryTime: Number,
      feePrice: {
        type: Number,
        default: 0.0,
      },
      freeFrom: {
        type: Number,
        default: 0.0,
      },
      minimumPurchase: {
        type: Number,
        default: 0.0,
      },
      neighborhood: Object,
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

module.exports = new DeliveryFee();
