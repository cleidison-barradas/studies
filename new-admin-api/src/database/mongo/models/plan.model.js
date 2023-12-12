// MongoDB Schema
const { Schema } = require('mongoose');

// Base model
const BaseModel = require('./internals/model-base');

class Plan extends BaseModel {
  constructor() {
    super();
    // Schema name
    this.schemaName = 'plan';

    // Definition
    this.schemaDefinition = new Schema({
      name: String,
      description: String,
      price: Number,
      rule: {
        type: String,
        enum: ['start', 'pro', 'pro-branch'],
        default: 'start'
      },
      permissions: {
        paths: Array,
        default: []
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

    // Schema configuration
    this._configureSchema();
  }
}

module.exports = new Plan();
