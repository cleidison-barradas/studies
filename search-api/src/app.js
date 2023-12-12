// Api Core aws//
const { ORM } = require('@mypharma/api-core')

// HTTP Server
const HTTP = require('./http')

// Services
const { amqp } = require('./services')

// Config
const { mongoConfig } = require('./config')

module.exports = async () => {
  // Initialize ORM
  ORM.config = mongoConfig
  await ORM.setup()
  console.log('MongoDB ORM initialized!')

  // Initialize HTTP server
  HTTP.init()

  // // Initialize amqp
  // await amqp.init('search-capture')

  console.log(`API Initialize. Port: ${HTTP.port}`)
}
