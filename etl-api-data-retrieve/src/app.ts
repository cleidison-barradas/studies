// Load envs
require('dotenv').config()
// Cpus
import { cpus } from 'os'
// Sentry
import * as Sentry from '@sentry/node'

import { ORM } from '@mypharma/api-core'
// Queue
import { QueuePlugin } from '@mypharma/etl-engine'
// Configs
import redisConfig from './config/redis'
import queueConfig from './config/queue'
import socketConfig from './config/socket'
import { mysqlConfig, mongoConfig } from './config/database'

// Initializers
import { MySQLPlugin, RedisPlugin } from '@mypharma/etl-engine'
// Services
import { productService } from './domains/product/services/ProductService'
import { IETLRetrieveData, WorkerQueue, isMaster } from './support/helpers/WorkerQueue'

export default (async () => {
  // Startup Sentry
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: 'https://66263bb1b8b44f2f9b5e27bb1dcd9859@o319543.ingest.sentry.io/5745113',
      environment: process.env.NODE_ENV
    })

    Sentry.configureScope(scope => {
      scope.setTag('project', 'ETL Data Retrieve')
    })
  }

  try {
    // Setup ORM
    ORM.config = mongoConfig
    await ORM.setup(mongoConfig)
    console.log('ORM initialized!')

    // Init database connections
    MySQLPlugin.init(mysqlConfig)
    console.log('Database intialized!')

    // Init redis
    RedisPlugin.init(redisConfig)
    console.log('Redis initialized')

    // Define primary Queue
    const isPrimaryQueue = socketConfig.nodesPrimary.includes(socketConfig.node[0])

    if (isMaster) {

      // Init queue
      await QueuePlugin.init(queueConfig)
      console.log('AMQP initialized!')

      // Start nodes publish channel
      await QueuePlugin.start('retrieve-products', 'manual', socketConfig.node)
      await QueuePlugin.start('send-products', 'manual', isPrimaryQueue ? socketConfig.node : undefined)

      setTimeout(async () => {
        const workerQueue = new WorkerQueue(cpus().length)
        await workerQueue.forkWorkers()

        // Start services
        productService(workerQueue)

      }, 10000)

      console.log(`ETL 2.0 data retrieve started! on socket port ${socketConfig.node.toString()}`)

    } else {

      process.on('message', (connection: IETLRetrieveData) => WorkerQueue.worker(connection))
    }

  } catch (err) {
    console.log(err)
    Sentry.captureException(err)
  }
})()

