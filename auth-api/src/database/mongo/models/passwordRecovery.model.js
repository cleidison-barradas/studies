const { Schema, Types } = require('mongoose');

const BaseModel = require('./internals/model-base');

class PasswordRecovery extends BaseModel {
  constructor() {
    super();
    
    this.schemaName = 'passwordRecovery';
    
    this.schemaDefinition = new Schema({
      token:{
        type: String,
        required: true,
        select: false
      },
      expires: {
        type: Date,
        required: true,
        select: false
      },
      status:{
        type: String,
        enum: ['active', 'disable', 'expired'],
        default: 'active'
      },
      user:{
        type: Types.ObjectId,
        required: true
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

    this._configureSchema();
  }
}

module.exports = new PasswordRecovery();