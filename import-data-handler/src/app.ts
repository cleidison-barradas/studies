import 'dotenv/config'
import {
  QueuePlugin,
  QueuePluginCacheEngine
} from "./support/plugins/queue"
import { colors, logger, ORM } from "@mypharma/api-core"

import { handlerServices } from './domains/default/services'
import { promotionServices } from "./domains/default/services/promotionServices"

import databaseConfig from "./config/database"
import queueConfig from "./config/queue"

export default (async () => {
  try {
    ORM.config = databaseConfig

    await ORM.setup()
    logger('[MONGO] database initialized!', colors.FgCyan)

    await QueuePlugin.init(queueConfig.amqpHost)
    await QueuePluginCacheEngine.init(queueConfig.amqpHostCacheEngine)

    await QueuePlugin.start('erp-update', 'manual')
    await QueuePlugin.start('handle-import-pmc', 'manual')
    await QueuePlugin.start('handle-import-product', 'manual')
    await QueuePlugin.start('handle-import-customer', 'manual')
    await QueuePlugin.start('handle-product-promotion', 'manual')
    await QueuePlugin.start('handle-process-service-specials', 'manual')

    // Invalidate Cache
    await QueuePluginCacheEngine.start('mongo-invalidate-product')

    logger('[RABBITMQ] queue initialized!', colors.FgCyan)

    handlerServices()
    await promotionServices()

    logger('[SERVICE] import api initialized!', colors.FgCyan)

  } catch (error) {
    console.log(error)
  }
})()
