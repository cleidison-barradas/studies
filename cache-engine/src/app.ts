// Load envsaa
require('dotenv').config()
// Avoid ElasticSearch TLS error
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
import * as Sentry from '@sentry/node'
import { RedisPlugin } from '@mypharma/etl-engine'
import { colors, logger, ORM } from '@mypharma/api-core'
// Sentry
import config from './config/database'
import configQueue from './config/queue'
import { storeSyncProductChangeService } from './domains/store/services/storeSyncProductChangeService'
import { affiliateStoreService } from './domains/store/services/StoreAffiliateService'
import { productService, suggestService } from './domains/product/services/ProductService'

import { QueuePlugin } from './support/plugins/queue'
import redisConfig from './config/redis'

export default (async () => {

  try {
    ORM.config = config.mongoConnection
    await ORM.setup()
    logger('[MONGO] database initialized!', colors.FgCyan)

    RedisPlugin.init(redisConfig)
    logger('[REDIS] database initialized!', colors.FgCyan)

    await QueuePlugin.init(configQueue)

    await QueuePlugin.start('sync-product-change')
    await QueuePlugin.start('affiliate-store-change', 'manual')
    await QueuePlugin.start('mongo-invalidate-product', 'manual')
    await QueuePlugin.start('mongo-invalidate-suggest-product', 'manual')

    logger('[RABBITMQ] queue initialized!', colors.FgCyan)

    // Startup Sentry
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
      Sentry.init({
        dsn: 'https://7a71db6d2f4e446f885c6f6b264bc406@o319543.ingest.sentry.io/5602510',
        environment: process.env.NODE_ENV
      })

      Sentry.configureScope(scope => {
        scope.setTag('project', 'Cache Engine')
      })
    }

    productService()
    suggestService()
    affiliateStoreService()
    storeSyncProductChangeService()

    logger('Cache engine service initialized!', colors.FgGreen)

  } catch (error) {
    console.log(error)
    logger('Cache engine service Failure!', colors.FgRed)
  }
})()
