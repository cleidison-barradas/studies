// Load envs
require('dotenv').config()

// Sentry
import * as Sentry from '@sentry/node'

// Core
import { ORM } from '@mypharma/api-core'

// Configs
import mysqlConfig, { mongoConfig } from './config/database'
import redisConfig from './config/redis'
import queueConfig from './config/queue'
import socketConfig from './config/socket'

// Initializers
import { MySQLPlugin, RedisPlugin } from '@mypharma/etl-engine'

// Queue
import { QueuePlugin } from '@mypharma/etl-engine'

// Services
import { socketService } from './domains/socket/services/SocketService'
import { productService } from './domains/product/services/ProductService'

export default (async () => {
  // Startup Sentry
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: 'https://1396de3243e04195a4539dc3c9dac3f8@o319543.ingest.sentry.io/5693162',
      environment: process.env.NODE_ENV
    })

    Sentry.configureScope(scope => {
      scope.setTag('project', 'ETL Connection Handler')
    })
  }

  try {
    ORM.config = mongoConfig

    // Setup ORM
    if (process.env.DATABASE_MASTER_NAME) {
      await ORM.setup(null, process.env.DATABASE_MASTER_NAME)
    }
    await ORM.setup(null, mongoConfig.name)

    // Init database connections
    MySQLPlugin.init(mysqlConfig.connections[0])
    console.log('Database intialized!')

    // Init redis
    RedisPlugin.init(redisConfig)
    console.log('Redis initialized')

    // Init queue
    await QueuePlugin.init(queueConfig)
    console.log('AMQP initialized!')

    // Start publish/consume channel
    await QueuePlugin.start('retrieve-products', 'confirmation', [socketConfig.port.toString()]) // publish
    await QueuePlugin.start('persist-products', 'confirmation', [socketConfig.port.toString()]) // publish
    await QueuePlugin.start('mongo-persist-products', 'confirmation', [socketConfig.port.toString()]) // publish
    await QueuePlugin.start('send-products', 'manual', [socketConfig.port.toString()]) // consume
    await QueuePlugin.start('persisted-products', 'manual', [socketConfig.port.toString()]) // consume

    // Start services
    await socketService()
    await productService()

    console.log(`ETL 2.0 connections handler started on ${process.env.SOCKET_PORT}!`)

  } catch (err) {
    console.log(err)
    Sentry.captureException(err)
  }
})()

