const { Schema, Types } = require('mongoose');
const BaseModel = require('./internals/model-base');

class IntegrationSQL extends BaseModel {
  constructor() {
    super();

    this.schemaName = 'integrationSQL';
    this.softDelete = true;

    this.schemaDefinition = new Schema({
      name: {
        type: String,
        unique: true,
        required: true,
      },
      sql: {
        type: String,
        required: true,
      },
      erp: Object,
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      description: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

    this._configureSchema();
  }
}

module.exports = new IntegrationSQL();
