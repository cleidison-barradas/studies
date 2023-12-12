import 'dotenv/config'
import { colors, logger, ORM } from '@mypharma/api-core'
import { RedisPlugin } from '@mypharma/etl-engine'

import { defaultService } from './domains/default/services/defaultService'
import { QueueMainPlugin } from './support/plugins/queue'

import mongoConfig from './config/database'
import queueConfig from './config/queue'
import redisConfig from './config/redis'

export default (async () => {
  try {
    ORM.config = mongoConfig
    await ORM.setup()
    logger('[MONGO] database initialized!', colors.FgCyan)

    RedisPlugin.init(redisConfig)
    logger('[REDIS] database initialized!', colors.FgCyan)

    await QueueMainPlugin.init(queueConfig.main)

    await QueueMainPlugin.start('ifood_sync_order', 'confirmation')
    await QueueMainPlugin.start('ifood-retrieve-products', 'confirmation', queueConfig.nodes)

    logger('[RABBITMQ] queues initialized!', colors.FgCyan)

    defaultService()

    logger(`Ifood retrieve service initialized! on nodes: ${queueConfig.nodes.toString()}`, colors.FgYellow)

  } catch (error) {
    console.log(error)
    logger('Failure on start services !', colors.FgRed)
  }
})()