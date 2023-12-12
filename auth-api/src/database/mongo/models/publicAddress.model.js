const { Schema, Types } = require('mongoose');
const BaseModel = require('./internals/model-base');

class PublicAddress extends BaseModel {
  constructor() {
    super();

    this.schemaName = 'publicAddress';
    this.softDelete = true;

    this.schemaDefinition = new Schema({
      street: String,
      number: Number,
      complement: String,
      customer: Object,
      neighborhood: Object,
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

module.exports = new PublicAddress();
