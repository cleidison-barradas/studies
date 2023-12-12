const { Schema } = require('mongoose')

const BaseModel = require('./internals/model-base')

class Notification extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'notification'

    this.schemaDefinition = new Schema({

      title: {
        type: String,
        default: ''
      },

      message: {
        type: String,
        default: ''
      },

      products: {
        type: Array,
        required: false,
        default: null,
      },

      active:{
        type: Boolean,
        default: true
      },

      type:{
        type: String,
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

module.exports = new Notification()
