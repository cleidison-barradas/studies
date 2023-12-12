const { Schema, Types } = require('mongoose')

const BaseModel = require('./internals/model-base')

class Billboard extends BaseModel {
    constructor() {
        super()

        this.schemaName = 'billboard'

        this.softDelete = true

        this.schemaDefinition = new Schema({
            message: String,
            title: String,
            stores: {
                type: Array,
                default: [String],
            },
            active: Boolean,
            startAt: Date,
            endAt: Date,
            updatedAt: {
                type: Date,
                default: Date.now,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        })

        this._configureSchema()
    }
}

module.exports = new Billboard()
