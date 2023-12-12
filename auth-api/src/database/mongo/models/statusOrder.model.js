const { Schema, Types } = require('mongoose');
const BaseModel = require('./internals/model-base');

class StatusOrder extends BaseModel {
  constructor() {
    super();

    this.schemaName = 'statusOrder';
    this.softDelete = true;

    this.schemaDefinition = new Schema({
      originalId: Number,
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ['accepted', 'pending' ,'rejected'],
        default: 'pending',
        required: true,
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

module.exports = new StatusOrder();
