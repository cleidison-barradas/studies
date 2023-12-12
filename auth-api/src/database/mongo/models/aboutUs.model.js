const { Schema, Types } = require('mongoose')

const BaseModel = require('./internals/model-base')

class AboutUs extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'aboutUs'

    this.softDelete = true 
    

    this.schemaDefinition = new Schema({
      content: String,
      published: {
        type: Boolean,
        default: false
      },
      user: Object,
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

module.exports = new AboutUs()
