const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class Settings extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'settings'

    this.schemaDefinition = new Schema({
      originalId: {
        type: Number,
        required: true,
      },
      code: {
        type: String,
        required: true,
      },
      key: {
        type: String,
        required: true,
      },
      value: {
        type: String,
      },
      serialized: Number
    })

    this._configureSchema()
  }
}

module.exports = new Settings()
