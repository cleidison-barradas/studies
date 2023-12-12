const { Schema, Types } = require('mongoose')

const BaseModel = require('./internals/model-base')

class HistoryAboutUs extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'historyAboutUs'

    this.softDelete = true 
    
    this.schemaDefinition = new Schema({
      oldContent: String,
      aboutUs:Object,
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

module.exports = new HistoryAboutUs()
