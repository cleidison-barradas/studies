// Libaries
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

// Sentry
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

// Config
const { http } = require('../config')

// Routes
const routes = require('./routes')

// Body raw parsing
const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8')
  }
}

class Http {
  /**
   * Initialize HTTP server
   * @returns {Http}
   */
  async init() {
    // Set port
    this.port = http.port

    // Initialize express
    this.app = express()
    this.app.listen(this.port)

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
      // Sentry config
      Sentry.init({
        dsn: 'https://86b6add1880344cfbd779ccf82f05dcb@o319543.ingest.sentry.io/5602656',
        environment: process.env.NODE_ENV,
        integrations: [
          // enable HTTP calls tracing
          new Sentry.Integrations.Http({ tracing: true }),
          // enable Express.js middleware tracing
          new Tracing.Integrations.Express({ app: this.app })
        ]
      })
  
      Sentry.configureScope(scope => {
        scope.setTag('project', 'Search Engine API')
      })
      
      // RequestHandler creates a separate execution context using domains, so that every
      // transaction/span/breadcrumb is attached to its own Hub instance
      this.app.use(Sentry.Handlers.requestHandler())
      // TracingHandler creates a trace for every incoming request
      this.app.use(Sentry.Handlers.tracingHandler())
      // The error handler must be before any other error middleware and after all controllers
      this.app.use(Sentry.Handlers.errorHandler())
    }

    // Configure logging
    this.app.use(
      morgan('common', {
        // access log
        stream: fs.createWriteStream(http.logging.access, { flags: 'w' }),
      })
    )
  
    this.app.use(
      morgan('common', {
        // error log
        skip(req, res) {
          return res.statusCode < 400
        },
        stream: fs.createWriteStream(http.logging.error, { flags: 'w' }),
      })
    )

    // Parse body to json
    this.app.use(bodyParser.json({ verify: rawBodyBuffer }))
  
    // Cors setup
    this.app.use(cors({ exposedHeaders: 'Authorization' }))
    this.app.options('*', cors({ exposedHeaders: 'Authorization' }))
  
    // Routing
    this.app.get('/health', (req, res) => {
      return res.status(200).json({ "message" : "ok" })
    })
    this.app.use('/', routes)

    return this
  }
}

module.exports = new Http()