const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class File extends BaseModel {
  constructor() {
    super()
    this.schemaName = 'file'

    this.schemaDefinition = new Schema({
      name: String,
      url: String,
      key: String,
      folder: String,
      updatedAt: {
        type: Date,
        default: Date.now
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    })

    this._configureSchema()
  }
}

module.exports = new File()
