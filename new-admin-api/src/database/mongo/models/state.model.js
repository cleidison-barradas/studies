const { Schema, Types } = require('mongoose');
const BaseModel = require('./internals/model-base');

class State extends BaseModel {
  constructor() {
    super();

    this.schemaName = 'state';
    this.softDelete = true;

    this.schemaDefinition = new Schema({
      name: String,
      country: Object,
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

module.exports = new State();
