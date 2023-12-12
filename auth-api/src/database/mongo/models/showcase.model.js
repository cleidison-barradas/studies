// MongoDB Schema
const { Schema, Types } = require('mongoose')

// Base model
const BaseModel = require('./internals/model-base')

class ShowCase extends BaseModel {
    constructor() {
        super()

        // Schema name
        this.schemaName = 'showCase'

        // Definition
        this.schemaDefinition = new Schema({
            name: String,
            initialDate: {
                default: null,
                type: Date,
            },
            finalDate: {
                default: null,
                type: Date,
            },
            products: [
                {
                    product: Object,
                    position: {
                        type: Number,
                        default : null
                    }
                }
            ],
            position: {
                type: Number,
                default: null,
            },
            status: {
                type: Boolean,
                default: true,
            },
            main:{
                type: Boolean,
                default: false, 
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

module.exports = new ShowCase()
