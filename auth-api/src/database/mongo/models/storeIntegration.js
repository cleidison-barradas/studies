const { Schema, Types } = require('mongoose');
const BaseModel = require('./internals/model-base');

class StoreIntegration extends BaseModel {
  constructor() {
    super();

    this.schemaName = 'storeIntegration';
    this.softDelete = true;

    this.schemaDefinition = new Schema({
      store: Object,
      erp: Object,
      integration: Object,
      fields: {
        type: Array,
        default: []
      },
      onlyFractioned: {
        type: Boolean,
        default: false
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

module.exports = new StoreIntegration();
