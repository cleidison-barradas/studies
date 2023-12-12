require('dotenv').config()
// HTTP Server
const http = require('./http')
// Utils
const logger = require('./utils/logger')

const { Color } = require('./utils/constants')
// Mongo ORM setup and Queue
const { ORM } = require('@mypharma/api-core')
// Configs
const { mongoConfig } = require('./config')
//
const queueConfig = require('./config/queue')

const { QueuePlugin, CacheQueuePlugin } = require('./plugins/queue')

module.exports = (async () => {
    try {
        // Configure HTTP server
        const PORT = process.env.HTTP_SERVER_PORT || process.env.PORT

        http.configure(PORT, {})

        // Initalize api core
        ORM.config = mongoConfig
        await ORM.setup()
        logger("[MONGO] database initialized", Color.FgGreen)
        // Initialize HTTP server
        const port = await http.init();

        await http.setUpDocs();

        //Initialize Queue
        await QueuePlugin.init(queueConfig.main)
        await CacheQueuePlugin.init(queueConfig.cacheEngine)

        await QueuePlugin.start("erp-update", "confirmation")
        await CacheQueuePlugin.start("mongo-invalidate-product")

        logger(`[SERVER] Listening on port:${port}`, Color.FgCyan);

    } catch (error) {
        logger('Failed to initialize services!', Color.FgRed);
        console.log(error);
    }
})()