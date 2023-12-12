const { Schema, Types } = require('mongoose');
const BaseModel = require('./internals/model-base');
class IntegrationOptions extends BaseModel {
  constructor() {
    super();

    this.schemaName = 'integrationoptions';

    this.schemaDefinition = new Schema({
      name: String,
      type: String,
    });

    this._configureSchema();
  }
}
module.exports = new IntegrationOptions();
