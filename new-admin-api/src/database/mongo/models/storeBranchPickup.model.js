const { Schema } = require("mongoose");
const BaseModel = require("./internals/model-base");

class StoreBranchPickup extends BaseModel {
  constructor() {
    super();
    this.schemaName = "storeBrachPickup";

    this.schemaDefinition = new Schema({
      name: {
        type: String,
        required: true,
      },
      address: Object,
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

module.exports = new StoreBranchPickup();
