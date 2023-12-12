/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

import 'reflect-metadata'
import { captureException } from '@sentry/node'
import { createApp, ORM } from '@mypharma/api-core'
import { databaseConfig } from './config/database'

export default (async () => {
  try {
    ORM.config = databaseConfig

    // Setup ORM
    if (process.env.DATABASE_MASTER_NAME) {
      await ORM.setup(null, process.env.DATABASE_MASTER_NAME)
    }
    await ORM.setup(null, databaseConfig.name)

    const app = createApp({
      middlewareWhiteList: [],
      controllers: [__dirname + '/domains/**/controllers/*{.ts,.js}'],
    })

    const HTTP_PORT = process.env.HTTP_SERVER_PORT || process.env.PORT

    app.use('/health', (req, res) => {
      const helthcheck = {
        message: 'OK',
        timestamp: Date.now(),
        uptime: process.uptime(),
        responsetime: process.hrtime(),
      }

      try {

        return res.send(helthcheck)

      } catch (error) {
        console.log(error)
        helthcheck.message = error.message

        return res.status(500).send(helthcheck)
      }
    })

    app.listen(HTTP_PORT, () => {
      console.log(`API up and running on ${HTTP_PORT}`)
    })
  } catch (error) {
    console.error(error)
    captureException(error)
  }
})()

