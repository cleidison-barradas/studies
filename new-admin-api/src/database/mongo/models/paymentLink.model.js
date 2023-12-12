const { Schema } = require("mongoose");

const BaseModel = require("./internals/model-base");

class PaymentLink extends BaseModel {
  constructor() {
    super();
    this.schemaName = "paymentLink";
    this.softDelete = true;

    this.schemaDefinition = new Schema({
      fingerprint: {
        type: String,
        required: true,
        unique: true,
      },
      cartId: String,
      link: String,
      total: Number,
      deliveryFee: Number,
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

module.exports = new PaymentLink();
