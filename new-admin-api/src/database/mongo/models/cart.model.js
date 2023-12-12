// MongoDB Schema
const { Schema } = require("mongoose");

// Base model
const BaseModel = require("./internals/model-base");

class Cart extends BaseModel {
  constructor() {
    super();
    this.schemaName = "cart";
    this.schemaDefinition = new Schema({
      storeId: {
        type: String,
        required: true
      },
      customerId: {
        type: String,
        default: null
      },
      fingerprint: {
        type: String,
        unique: true,
      },
      cupom: {
        type: Object,
        default: null,
      },
      purchased: {
        type: String,
        enum: ['NO', 'YES'],
        required: true,
        default: 'NO'
      },
      products: {
        type: Array,
        default: []
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });
  }
}

module.exports = new Cart();
