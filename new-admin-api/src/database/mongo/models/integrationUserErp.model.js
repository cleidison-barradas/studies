const { Schema, Types } = require('mongoose')
const BaseModel = require('./internals/model-base');

class IntegrationUserErp extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'integrationusererp'
    this.softDelete = true

    this.schemaDefinition = new Schema({
      email: String,
      userName: String,
      password: String,
      token: String,
      store: Array,
      baseUrl: String,
      erpId: Array,
      admin: {
        type: Boolean,
        default: false
      },
      lastSeen: {
        type: Date,
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

    this._configureSchema()
  }
}

module.exports = new IntegrationUserErp()
