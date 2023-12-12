const { Schema, Types } = require('mongoose');
const BaseModel = require('./internals/model-base');

class HistoryOrder extends BaseModel {
  constructor() {
    super();

    this.schemaName = 'historyOrder';

    this.schemaDefinition = new Schema({
      originalId: Number,
      order: {
        type: Types.ObjectId,
        ref: 'OrderSchema',
        required: true,
      },
      status: {
        type: Types.ObjectId,
        ref: 'StatusOrderSchema',
        required: true,
      },
      notify: {
        type: Boolean,
        default: false
      },
      comments: {
        type: String,
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

    this._configureSchema();
  }
}

module.exports = new HistoryOrder();
