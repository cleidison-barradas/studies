// Load envs
require('dotenv').config()

import 'reflect-metadata'
import * as Sentry from '@sentry/node'
import { initDb, ConnectionType } from './support/plugins/db'
import { AMQP } from './support/plugins/queue'
import { searchWatchService } from './domains/search/services/SearchWatch'

export default (async () => {
  // Startup Sentry
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: 'https://a7614851865a4e88b0377264cfbca22e@o319543.ingest.sentry.io/5633906',
      environment: process.env.NODE_ENV
    })

    Sentry.configureScope(scope => {
      scope.setTag('project', 'Watcher')
    })
  }

  try {
    // Initialize database
    await initDb(ConnectionType.WATCHER)
  
    // Call singleton
    const amqp = AMQP.getInstance()
    await amqp.init()
  
    console.log('I am watching everything now...')
  
    // Initialize services
    searchWatchService()
  } catch (err) {
    console.log(err)
    Sentry.captureException(err)
  }
})()
