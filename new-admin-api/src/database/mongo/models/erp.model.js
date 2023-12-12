const { Schema, Types } = require('mongoose');
const BaseModel = require('./internals/model-base');

class ERP extends BaseModel {
  constructor() {
    super();

    this.schemaName = 'erp';
    this.softDelete = true;

    this.schemaDefinition = new Schema({
      name: {
        type: String,
        unique: true,
      },
      dialect: {
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

module.exports = new ERP();
