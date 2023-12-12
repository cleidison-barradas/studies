import 'dotenv/config'
import { colors, logger, ORM } from '@mypharma/api-core'
import monogoConfig from './config/database'
import queueConfig from './config/queue'
import { QueuePlugin } from './support/plugins/queue'
import { executeProcess } from './domains/default/services/executeService'

export default (async () => {

  try {

    ORM.config = monogoConfig
    await ORM.setup()
    logger('Mongo [ORM] initialized!', colors.FgYellow)

    await QueuePlugin.init(queueConfig.main)
    logger('Queue [Rabbitmq] initialized!', colors.FgBlue)

    await QueuePlugin.start('etl-api-extractor-products', 'confirmation')

    executeProcess()

  } catch (error) {
    console.log(error)
  }
})()
