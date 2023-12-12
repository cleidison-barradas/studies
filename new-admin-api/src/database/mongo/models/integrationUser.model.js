const { Schema, Types } = require('mongoose')
const BaseModel = require('./internals/model-base');

class IntegrationUser extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'user'
    this.softDelete = true

    this.schemaDefinition = new Schema({
      store: Object,
      erpVersion: Object,
      storeOriginalId: Number,
      storeOriginalName: String,
      username: String,
      password: String,
      salt: String,
      erp: Object,
      active: {
        type: Boolean,
        default: true
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

module.exports = new IntegrationUser()
