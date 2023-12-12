const { Schema, Types } = require('mongoose')
const BaseModel = require('./internals/model-base');

class IntegrationErpVersion extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'erpVersion'
    this.softDelete = true

    this.schemaDefinition = new Schema({
      name: String,
      erpId: {
        type: Types.ObjectId
      },
      sql: Array,
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

module.exports = new IntegrationErpVersion()
