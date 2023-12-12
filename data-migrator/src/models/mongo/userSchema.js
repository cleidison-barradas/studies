// MongoDB Schema
const { Schema } = require('mongoose')
// Base model
const BaseModel = require('./internals/model-base')
// Token Generator
const TokenGenerator = require('uuid-token-generator');

class User extends BaseModel {
  constructor() {
    super();

    // Schema name
    this.schemaName = 'user';

    // Definition
    this.schemaDefinition = new Schema({
      originalId: Number,
      originalStoreId: Number,
      originalUserGroupId: Number,
      userName: String,
      plan: Object,
      salt: String,
      name: String,
      email: String,
      avatar: String,
      refreshToken: String,
      store: [],
      password: {
        type: String,
        required: true
      },
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
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    })

    this.schemaDefinition.pre('save', function() {
      const tokenGen = new TokenGenerator(512, TokenGenerator.BASE71);
      const refreshToken = tokenGen.generate();

      return this.refreshToken = refreshToken

    })

    // Schema configuration
    this._configureSchema();
  }
}

module.exports = new User();
