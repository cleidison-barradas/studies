const { Schema, Types } = require('mongoose');
const BaseModel = require('./internals/model-base');

class Neighborhood extends BaseModel {
  constructor() {
    super();

    this.schemaName = 'neighborhood';
    this.softDelete = true;

    this.schemaDefinition = new Schema({
      name: String,
      city: Object,
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

module.exports = new Neighborhood();
