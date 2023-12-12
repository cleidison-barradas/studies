const { Schema, Types } = require('mongoose');
const BaseModel = require('./internals/model-base');

class HistoryOrder extends BaseModel {
  constructor() {
    super();

    this.schemaName = 'historyOrder';
    this.softDelete = true;

    this.schemaDefinition = new Schema({
      order: Object,
      status: Object,
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
