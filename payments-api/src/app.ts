/* eslint-disable @typescript-eslint/no-var-requires */ //aws
require('dotenv').config()

import 'reflect-metadata'
import { createApp, ORM, RedisPlugin } from '@mypharma/api-core'
import { databaseConfig } from './config/database'
import amqp from './services/amqp'
import redisConfig from './config/redis'

export default (async () => {
  try {
    ORM.config = databaseConfig
    // Setup ORM
    await ORM.setup()

    RedisPlugin.init(redisConfig)

  } catch (error) {
    console.log(error)
  }
  const app = createApp({
    middlewareWhiteList: [__dirname + '/domains/health/healthCheck.ts'],
    controllers: [__dirname + '/domains/v1/**/controllers/*{.ts,.js}', __dirname + '/domains/v2/**/*.controller{.ts,.js}'],
  })

  await amqp.init('attraction-capture')

  const SERVER_PORT = process.env.HTTP_SERVER_PORT || process.env.PORT

  app.listen(SERVER_PORT, () => {
    console.log(`API up and running on ${SERVER_PORT}`)
  })
})()
