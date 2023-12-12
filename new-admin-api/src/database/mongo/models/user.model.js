// MongoDB Schema
const { Schema, Types } = require('mongoose');

// Base model
const BaseModel = require('./internals/model-base');

class User extends BaseModel {
  constructor() {
    super();

    // Schema name
    this.schemaName = 'user';

    // Definition
    this.schemaDefinition = new Schema({
      originalId: Number,
      userName: String,
      password: {
        type: String,
        required: true
      },
      name: String,
      email: String,
      avatar: String,
      plan: Object,
      role: {
        type: String,
        enum: ['admin', 'store', 'support'],
        default: 'store'
      },
      status: {
        type: String,
        enum: ['active', 'disabled'],
        default: 'active'
      },
      store: [],
      refreshToken: String,
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

module.exports = new User();
