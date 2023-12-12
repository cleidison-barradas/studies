const { Schema, Types } = require('mongoose')
const BaseModel = require('./internals/model-base');

class IntegrationErp extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'erp'
    this.softDelete = true

    this.schemaDefinition = new Schema({
      name: String,
      hasOrderSupport: {
        type: Boolean,
        default: false
      },
      versions: Array,
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

    this._configureSchema()
  }
}

module.exports = new IntegrationErp()
