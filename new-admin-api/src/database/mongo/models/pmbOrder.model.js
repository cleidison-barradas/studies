// MongoDB Schema
const { Schema } = require('mongoose');

// Base model
const BaseModel = require('./internals/model-base');

class PbmOrder extends BaseModel {
  constructor() {
    super();
    // Schema name
    this.schemaName = 'pbmorder';

    // Definition
    this.schemaDefinition = new Schema({
      orderId: {
        type: String,
        required: true
      },
      storeId: {
        type: String,
        required: true
      },
      saleId: {
        type: String,
        required: true,
        default: null
      },
      saleReceipt: {
        type: String,
        required: true,
        default: null
      },
      status: {
        type: String,
        required: true,
        enum: ['PENDING', 'COMPLETED', 'ERROR', 'CANCEL'],
        default: 'PENDING'
      },
      storeSequenceId: {
        type: String,
        default: null
      },
      authorizationId: {
        type: Number,
        required: true
      },
      elegibilityToken: {
        type: String,
        required: true
      },
      fiscalDocument: {
        type: Object,
        default: null
      },
      items: {
        type: Array,
        default: null
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

    // Schema configuration
    this._configureSchema();
  }
}

module.exports = new PbmOrder();
