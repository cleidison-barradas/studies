const { Schema } = require('mongoose');
const BaseModel = require('./internals/model-base');

class StoreGroup extends BaseModel {
  constructor() {
    super();
    this.schemaName = 'storeGroup';

    this.schemaDefinition = new Schema({
      name: {
        type: String,
        required: true,
      },
      stores: [],
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

module.exports = new StoreGroup();
