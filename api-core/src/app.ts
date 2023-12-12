/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata'
import { createExpressServer } from 'routing-controllers'
import { Application } from 'express'
import { captureException } from '@sentry/node'
import { BaseMiddleware } from './middlewares/BaseMiddleware'
import { ICreateAppConfig } from './interfaces/app/CreateAppConfig'

export { urlencoded } from 'express'

export const createApp = (options: ICreateAppConfig): Application => {
  // Setup whitelist
  if (options.middlewareWhiteList) {
    BaseMiddleware.setWhitelist(options.middlewareWhiteList)
  }

  const app = createExpressServer({
    ...options,
    cors: true
  })

  app.on('error', async (err) => {
    console.log('API ERROR: ' + err)
    captureException(err)
  })

  return app
}
