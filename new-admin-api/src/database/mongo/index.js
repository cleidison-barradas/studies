/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
// MongooseJS
const mongoose = require('mongoose')

// sha256
const sha256 = require('sha256')

// Models
const Models = require('./models')

// Config
const {
    databases: { mongoDB },
} = require('../../config')

// Utils
const {
    logger,
    constants: { Color },
} = require('myp-admin/utils')

// Reconnect config
const MAX_RECONNECT_ATTEMPTS = mongoDB.maxReconnectAttempts
let CURRENT_RECONNECT_ATTEMPTS = 0

// Wrapper promise
mongoose.Promise = require('bluebird').Promise

// Connection instance
let DATABASE = mongoose.connection

/**
 * MongoDB initialize connection
 */
const init = async () => {
    try {
        // Connect
        const connectionConfig = {
            ...mongoDB,
        }

        mongoose.connection.on('connected', (args) => {
            logger(`Mongo connected`, Color.FgGreen)
        })
        mongoose.connection.on('close', () => {
            logger(`Mongo connection closed`, Color.FgGreen)
        })

        DATABASE = await mongoose.connect(connectionConfig.connectionString, connectionConfig.options)

        await loadModels()

        return DATABASE
    } catch (error) {
        if (error.name && error.name === 'MongoNetworkError') {
            reconnect()
        } else {
            console.log('Erro no mongo ', error)
            throw error
        }
    }
}

/**
 * MongoDB reconnect
 */
const reconnect = () => {
    if (CURRENT_RECONNECT_ATTEMPTS < MAX_RECONNECT_ATTEMPTS) {
        CURRENT_RECONNECT_ATTEMPTS++

        logger('Could not reach MongoDB! Retrying in 5 secs...', Color.FgRed)
        setTimeout(() => {
            init()
        }, 5000)
    } else {
        logger('Could not connect to MongoDB. Please check if all services is working and restart the API.')
    }
}

/**
 * Load all mongo models
 */
const loadModels = async () => {
    const blackListAdmin = [
        'ProductPromotion',
        'ShowCaseSchema',
        'GanalyticsSchema',
        'HistoryAboutUsSchema',
        'OpeningHourSchema',
        'DeliveryFeeSchema',
        'DistanceDeliveryFeeSchema',
        'CustomerSchema',
        'BannerSchema',
        'PublicAddressSchema',
        'HistoryOrderSchema',
        'AboutUsSchema',
        'OrderSchema',
        'PaymentMethodSchema',
        'CupomSchema',
        'DeliverySchedule',
        'IntegrationUserSchema',
        'IntegrationErpSchema',
        'IntegrationSessionSchema',
        'IntegrationErpVersionSchema',
        'SearchSchema',

    ]

    const keys = Object.keys(Models).filter((value) => {
        if (blackListAdmin.includes(value)) {
            return false
        }
        return true
    })

    for await (const key of keys) {
        try {
            if (!Object.keys(DATABASE.models).includes(key)) {
                const schema = Models[key]

                // Define model
                const model = DATABASE.model(key, schema.schemaDefinition, schema.schemaName.toLowerCase())
                // Save model instance
                schema._setModel(model)

                // Sync model
                await model.syncIndexes()
            }
        } catch (error) {
            console.log(error)
        }
    }
}

/**
 * Validate object id
 *
 * @param {String} id
 */
const validateId = (id) => mongoose.Types.ObjectId.isValid(id)

/**
 * Create default records
 * We need some data for our system gets usable. Such as a default user or default permissions
 */
const createDefaultRecords = async () => {
    const { UserSchema } = Models
    const UserModel = UserSchema.Model()

    // Does we have already any user created?
    const usersCount = await UserModel.countDocuments()
    if (usersCount === 0) {
        logger('No users were found. Creating default user...', Color.FgYellow)

        await UserModel.create({
            name: 'User Default',
            email: 'user@localhost',
            password: sha256('123456'),
        })

        logger(`========================`, Color.FgGreen)
        logger(`User default created! There is below the default credentials`, Color.FgGreen)
        logger(`Email: user@localhost`, Color.FgGreen)
        logger(`Password: 123456`, Color.FgGreen)
        logger(`========================`, Color.FgGreen)
    }
}

/**
 *
 * @param {string} tenant
 * @returns
 */
const getTenantDB = (tenant) => {
    if (mongoose.connection) {
        try {
            // useDb will return new connection
            const db = mongoose.connection.useDb(tenant, { useCache: true })
            logger(`Switching database to ${tenant}`, Color.FgBlue)
            return db
        } catch (error) {
            throw new Error(error.message)
        }
    }
}


/**
 *
 * @param {string} tenant
 * @param {string} modelName
 * @returns
 */
const getModelByTenant = (tenant, modelName) => {
    const tenantDb = getTenantDB(tenant)
    const schema = Models[modelName]
    if (!schema) {
        throw new Error('Schema not found')
    }
    return tenantDb.model(modelName, schema.schemaDefinition, schema.schemaName)
}

module.exports = {
    Models,
    DATABASE,
    init,
    reconnect,
    validateId,
    getModelByTenant
}
