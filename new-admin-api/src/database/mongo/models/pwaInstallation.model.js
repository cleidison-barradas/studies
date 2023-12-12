const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class installation extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'installation'

    this.schemaDefinition = new Schema({

      userAgent: {
        type: String,
        default: ''
      },

      clientIP: {
        type: Date,
        default: ''
      },

      createdAt: {
        type: Date,
        default: Date.now
      }
    })

    this._configureSchema()

  }
}

module.exports = new installation()
