const { Schema } = require('mongoose');
const BaseModel = require('./internals/model-base');

class Country extends BaseModel {
  constructor() {
    super();

    this.schemaName = 'country';
    this.softDelete = true;

    this.schemaDefinition = new Schema({
      name: String,
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

module.exports = new Country();
