require('dotenv').config()
const executeService = require('./domains/default/services/executeService')
const { logger, colors, QueuePlugin } = require('@mypharma/api-core')
const { databaseConfig } = require('./config')
const Mongo = require('./mongoDB')
const Mysql = require('./database')
const { main } = require('./config/queue')

module.exports = (async () => {
  try {
    await Mysql.configure(databaseConfig).init()
    logger('[MYSQL] initialized!', colors.FgYellow)
    await Mongo.init()
    logger('[MONGO] initialized!', colors.FgYellow)
    await QueuePlugin.init(main)
    logger('[RABBIMQ] initialized!', colors.FgYellow)
    await QueuePlugin.start('mongo-invalidate-product')

    await executeService()

  } catch (error) {
    console.log(error)
  }
})()
