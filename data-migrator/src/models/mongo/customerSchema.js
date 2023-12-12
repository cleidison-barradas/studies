const { Schema } = require('mongoose')
const BaseModel = require('./internals/model-base')

class Customer extends BaseModel {
  constructor() {
    super()

    this.schemaName = 'customer'
    this.softDelete = true

    this.schemaDefinition = new Schema({
      originalId: Number,
      fullName: String,
      firstname: {
        type: String,
        require: true,
      },
      lastname: {
        type: String,
        require: true,
      },
      email: {
        type: String,
        require: true,
      },
      phone: {
        type: String,
        require: true,
      },
      birthdate: {
        type: String,
      },
      password: {
        type: String,
        require: true,
      },
      salt: {
        type: String,
        require: true,
      },
      cpf: {
        type: String
      },
      status: {
        type: Boolean,
        default: true,
      },
      addresses: [
        {
          type: Object,
          default: []
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    })

    this._configureSchema()
  }
}

module.exports = new Customer()
