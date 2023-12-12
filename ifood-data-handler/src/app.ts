import 'dotenv/config'
import { colors, logger, ORM } from "@mypharma/api-core"
import { orderService } from "./domains/default/services/check.order.service"
import { MainQueuePlugin } from "./support/plugins/queue"
import databaseConfig from "./config/database"
import queueConfig from "./config/queue"

export default (async () => {
  try {
    ORM.config = databaseConfig
    await ORM.setup()
    logger('[MONGO] database initialized!', colors.FgCyan)

    await MainQueuePlugin.init(queueConfig.main)

    await MainQueuePlugin.start('ifood_sync_order', 'manual')
    logger('[RABBITMQ] queue initialized!', colors.FgCyan)

    await orderService()
    logger('Ifood data handler initialized!', colors.FgYellow)

  } catch (error) {
    console.log(error)
    logger('Failure on start services !', colors.FgRed)
  }
})()