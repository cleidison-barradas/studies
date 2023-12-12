const { Schema } = require('mongoose');
const BaseModel = require('./internals/model-base');

class Store extends BaseModel {
  constructor() {
    super();
    this.schemaName = 'store';
    this.softDelete = true;

    this.schemaDefinition = new Schema({
      originalId: {
        type: Number,
      },
      name: {
        type: String,
        required: true,
      },
      url: {
        type: String,
      },
      tenant: {
        type: String,
        required: true
      },
      pmc: Object,
      settings: {
        type: Object,
        required: true
      },
      mainStore: {
        type: Boolean,
        default: false
      },
      storeUrls: {
        type: Array,
        default: []
      },
      affiliateStores: {
        type: Array,
        default: []
      },
      plan: Object,
      erp: Object,
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

module.exports = new Store();
