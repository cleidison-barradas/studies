const { Schema, Types } = require('mongoose');
const BaseModel = require('./internals/model-base');

class IntegrationMethods extends BaseModel {
  constructor() {
    super();

    this.schemaName = 'IntegrationMethods';
    this.softDelete = true;

    this.schemaDefinition = new Schema({
      integrationOption: Object,
      integrationData: Object,
      lastIntegration: {
          type: Date,
          default: Date.now
      },
      active: Boolean,
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
module.exports = new IntegrationMethods();
