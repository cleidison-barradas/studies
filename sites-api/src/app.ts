/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

import 'reflect-metadata'
import { createApp, ORM, logger, colors, RedisPlugin } from '@mypharma/api-core'
import databaseConfig from './config/database'
import redisConfig from './config/redis'
import { epharmaService } from './services/syncEpharma'

export default (async () => {
  try {
    ORM.config = databaseConfig
    // Setup ORMm
    await ORM.setup(databaseConfig)
    logger('[MONGO] database initialized!', colors.FgBlue)
    RedisPlugin.init(redisConfig)
    logger('[REDIS] database initialized!', colors.FgBlue)

    const app = createApp({
      middlewareWhiteList: [__dirname + '/domains/health/healthCheck.ts'],
      controllers: [__dirname + '/domains/v1/**/controllers/*{.ts,.js}', __dirname + '/domains/v2/**/*.controller{.ts,.js}'],
    })

    const port = process.env.HTTP_SERVER_PORT || process.env.PORT
    app.listen(port, () => {
      logger(`API up and running on ${port}`, colors.FgGreen)
    })

  } catch (error) {
    logger(error, colors.FgRed)
    logger(`Failure on initialize API ${error.message}`, colors.FgRed)
  }

  // await epharmaService()

})()
