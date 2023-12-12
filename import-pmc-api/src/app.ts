import 'dotenv/config'
import { colors, createApp, logger, ORM } from "@mypharma/api-core"
import { QueuePlugin } from './support/plugins/queues'
import { databaseConfig } from './config/database'
import queueConfig from './config/queue'

export default (async () => {
  try {
    ORM.config = databaseConfig
    await ORM.setup()

    await QueuePlugin.init(queueConfig.amqpHost)

    await QueuePlugin.start('handle-import-pmc', 'confirmation')
    await QueuePlugin.start('handle-import-product', 'confirmation')
    await QueuePlugin.start('handle-import-customer', 'confirmation')
    await QueuePlugin.start('handle-product-promotion', 'confirmation')

    const app = createApp({ controllers: [__dirname + '/domains/v1/**/controllers/*{.ts,.js}'] })

    const PORT = process.env.HTTP_SERVER_PORT || process.env.PORT

    app.listen(PORT, () => {
      logger(`Api up and running on port ${PORT}`, colors.FgGreen)
    })

  } catch (error) {
    console.log(error)
    logger('Failure on start services!', colors.FgRed)
  }
})()
