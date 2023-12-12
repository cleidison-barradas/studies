const { Schema } = require('mongoose')
const BaseModel = require('./internals/model-base')

class Search extends BaseModel {
    constructor() {
        super()
        this.schemaName = 'search'

        this.schemaDefinition = new Schema({
            fingerprint: {
                type: String,
            },
            term: {
                type: String,
            },
            store: {
                type: Object,
            },
            user: {
                type: Object,
            },
            userAgent: {
                type: String,
            },
            converted: Boolean,
            result: {
                type: Array,
            },
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

module.exports = new Search()
