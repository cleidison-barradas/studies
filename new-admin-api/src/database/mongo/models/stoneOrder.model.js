const { Schema } = require('mongoose')
const BaseModel = require('./internals/model-base')

class StoneOrder extends BaseModel {
    constructor() {
        super()
        this.schemaName = 'stoneOrder'

        this.schemaDefinition = new Schema({
            order: Object,

            charge_id: {
                type: String
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
        this._configureSchema()
    }

}

module.exports = new StoneOrder()