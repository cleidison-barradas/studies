const { Schema, Types } = require('mongoose');
const BaseModel = require('./internals/model-base');

class Customer extends BaseModel {
  constructor() {
    super();
    this.schemaName = 'customer';
    this.softDelete = true;

    this.schemaDefinition = new Schema({
      originalId: Number,
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      fullName: {
        type: String,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
      },
      birthdate: {
        type: String,
      },
      phone: {
        type: String,
        default: ''
      },
      password: {
        type: String,
        required: true,
        select: false,
      },
      salt: {
        type: String,
      },
      cpf: {
        type: String
      },
      addresses: Array,
      status: {
        type: Boolean,
        default: true,
      },
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

    this._configureSchema();
  }
}

module.exports = new Customer();
