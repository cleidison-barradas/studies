/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()
import 'reflect-metadata'
import { colors, createApp, logger, ORM } from '@mypharma/api-core'
import { RawBodyMiddleware } from './middlewares'

import { QueuePlugin, QueuePluginGMV } from './helpers/queue'
import { amqphost, amqphostgmv } from './config/queue'
import { databaseConfig } from './config/database'
import { apiServices } from './services'

export default (async () => {
  try {
    // Default config
    ORM.config = databaseConfig
    // Setup ORM
    await ORM.setup()
    await QueuePlugin.init(amqphost)
    await QueuePluginGMV.init(amqphostgmv)

    const app = createApp({
      middlewareWhiteList: [__dirname + '/domains/health/**'],
      controllers: [__dirname + '/domains/**/*.controller{.ts,.js}'],
      middlewares: [RawBodyMiddleware],
    })

    await QueuePlugin.start('sync-product-change', 'confirmation')
    await QueuePluginGMV.start('gmv-report')

    const HTTP_PORT = process.env.HTTP_SERVER_PORT || process.env.PORT

    app.listen(HTTP_PORT, () => {
      logger(`Api up and running on ${HTTP_PORT}`, colors.FgGreen)
    })

    await apiServices()

  } catch (error) {
    logger(error, colors.FgRed)
  }

})()
