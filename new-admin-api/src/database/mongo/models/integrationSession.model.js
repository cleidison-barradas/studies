const { Schema, Types } = require('mongoose')
const BaseModel = require('./internals/model-base');

class IntegrationSession extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'session'
    this.softDelete = true

    this.schemaDefinition = new Schema({
      user: Object,
      token: String,
      privateKey: String,
      publicKey: String,
      lastSeen: Date,
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

module.exports = new IntegrationSession()
