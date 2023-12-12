// MongoDB Schema
const { Schema } = require('mongoose')

// Base model
const BaseModel = require('./internals/model-base')

class DeliverySchedule extends BaseModel {
  constructor() {
    super()

    // Schema name
    this.schemaName = 'deliverySchedule'
    
    // Definition
    this.schemaDefinition = new Schema({
      weekDay: {
          type: String,
          enum: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT','HOLIDAY', 'EVERYDAY','MONTOFRI','SATSUN',],
          required: true,
      },
      
      start: {
        type :  Date,
        required: true,
      },

      end: {
        type: Date,
        required: true,
      },
      interval: {
        type: Object,

        active: Boolean,
        intervalStart: Date,
        intervalEnd: Date,
      }

    })

    // Schema configuration
    this._configureSchema()
  }
}

module.exports = new DeliverySchedule()
