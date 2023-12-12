// Load envs
require('dotenv').config()
// Sentry
import * as Sentry from '@sentry/node'
// Configs
import databaseConfig, { database_integration } from './config/database'
import redisConfig from './config/redis'
import queueConfig from './config/queue'
import socketConfig from './config/socket'
// ELT Engine
import {
  RedisPlugin,
  QueuePlugin
} from '@mypharma/etl-engine'
// Core
import {
  ORM
} from '@mypharma/api-core'
// Cache engine plugin
import { CacheQueuePlugin } from './support/plugins/queue'
// Services
import { productService } from './domains/product/services/ProductService'

export default (async () => {
  // Startup Sentry
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: 'https://3560f1c2fda549819fd80bc6d0de08ae@o319543.ingest.sentry.io/6073225',
      environment: process.env.NODE_ENV
    })

    Sentry.configureScope(scope => {
      scope.setTag('project', 'ETL Mongo Transport')
    })
  }

  try {
    // Init ORM
    ORM.config = databaseConfig
    await ORM.setup(databaseConfig)

    await ORM.setup(null, database_integration)

    // Init redis
    RedisPlugin.init(redisConfig)
    console.log('Redis initialized')

    // Init queue
    await QueuePlugin.init(queueConfig.main)
    await CacheQueuePlugin.init(queueConfig.cacheEngine)
    console.log('AMQP initialized!')

    // Start nodes publish channel
    await QueuePlugin.start('mongo-persist-products', 'manual', socketConfig.nodes)
    await QueuePlugin.start('persisted-products', 'manual', socketConfig.nodes)
    await CacheQueuePlugin.start('mongo-invalidate-product') // Invalidate products

    // Start services
    productService()

    console.log(`ETL 2.0 mongo transport started on socket port ${socketConfig.nodes.toString()}`)

  } catch (err) {
    console.log(err)
    Sentry.captureException(err)
  }
})()

