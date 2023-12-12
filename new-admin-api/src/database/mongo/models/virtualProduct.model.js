/* eslint-disable func-names */
const { Schema } = require('mongoose')
const BaseModel = require('./internals/model-base')
const productSchemaDefinition = require('../schemaDefinition/productSchemaDefinition')

class VirtualProduct extends BaseModel {
  constructor() {
    super()
    this.schemaName = 'virtualProduct'
    this.softDelete = true

    this.schemaDefinition = productSchemaDefinition

    this._configureSchema()
  }
}
module.exports = new VirtualProduct()