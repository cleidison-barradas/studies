const path = require('path')

// Api Core
const { ConnectionType } = require('@mypharma/api-core')

const {
  ELASTICSEARCH_HOST,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,

  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,

  HTTP_SERVER_PORT,
  HTTP_ACCESS_LOG_FILE,
  HTTP_ERROR_LOG_FILE,

  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,

  AMQP_HOST
} = process.env

/**
 * Default logs files
 */
const ACCESS_LOG = path.join(__dirname, '../../', 'storage/logs', 'access.log')
const ERROR_LOG = path.join(__dirname, '../../', 'storage/logs', 'error.log')

/* Para conexão com banco local, deixar a env DATABASE_ENV em branco */

const connectionDBAtlas = {
  type: 'mongodb',
  url: `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/?retryWrites=true&w=majority`,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  name: process.env.DATABASE_NAME,
  database: process.env.DATABASE_NAME,
  connectionType: ConnectionType.Master,
}

const connectionDBLocal = {
  type: 'mongodb',
  useNewUrlParser: true,
  useUnifiedTopology: true,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
  name: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  authSource: process.env.DATABASE_AUTH_SOURCE,
  connectionType: ConnectionType.Master,
}

module.exports = {
  http: {
    port: process.env.PORT || HTTP_SERVER_PORT,
    logging: {
      access:
        HTTP_ACCESS_LOG_FILE && HTTP_ACCESS_LOG_FILE.length > 0
          ? HTTP_ACCESS_LOG_FILE
          : ACCESS_LOG,
      error:
        HTTP_ERROR_LOG_FILE && HTTP_ERROR_LOG_FILE.length > 0
          ? HTTP_ERROR_LOG_FILE
          : ERROR_LOG,
    }
  },
  elasticsearchConfig: {
    host: ELASTICSEARCH_HOST,
    auth: ELASTICSEARCH_USERNAME && ELASTICSEARCH_PASSWORD ? {
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD
    } : null
  },
  redisConfig: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    family: 4
  },
  mongoConfig: process.env.DATABASE_ENV ? connectionDBAtlas : connectionDBLocal,
  amqpHost: AMQP_HOST
}
