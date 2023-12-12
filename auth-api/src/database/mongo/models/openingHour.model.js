// MongoDB Schema
const { Schema, Types } = require('mongoose')

// Base model
const BaseModel = require('./internals/model-base')

class OpeningHour extends BaseModel {
  constructor() {
    super()

    // Schema name
    this.schemaName = 'openingHour'

    this.softDelete = true 
    
    // Definition
    this.schemaDefinition = new Schema({
      weekDay: {
          type : String,
          enum : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT','HOLIDAY'],
          required : true
      },
      openingTime: {
          type : String,
          required : true
      },
      closingTime: {
        type : String,
        required : true
      },
      updatedAt: {
        type: Date,
        default: Date.now
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    })

    // Schema configuration
    this._configureSchema()
  }
}

module.exports = new OpeningHour()
