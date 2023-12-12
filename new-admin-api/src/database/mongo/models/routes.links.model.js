const { Schema } = require('mongoose');
const BaseModel = require('./internals/model-base');

class RoutesLink extends BaseModel {
  constructor() {
    super();
    this.schemaName = 'routeslinks';

    this.schemaDefinition = new Schema({
      title: {
        type: String,
        required: true,
      },
      path: {
        type: String,
        require: true
      },
      image: {
        type: String,
      },
      sort: {
        type: Number,
        unique: true,
        sparse: true
      },
      roles: {
        type: Array
      },
      external: String,
      children: {
        type: Array,
      },
    });

    this._configureSchema();
  }
}

module.exports = new RoutesLink();
