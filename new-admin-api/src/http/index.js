// Sentry
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

// Libaries
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { errors } = require('celebrate')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../../swagger-output.json')
// Config
const { http } = require('../config');
const { authMiddleware } = require('../http/middlewares');


// Routes
const routes = require('./routes');

// Body raw parsing
const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

class Http {
  /**
   * Initialize HTTP server
   * @returns {Http}
   */
  async init() {
    // Initialize express
    this.app = express();
    this.app.listen(http.port);
    console.log("App listening to port ", http.port)


    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
      // Sentry config
      Sentry.init({
        dsn: 'https://4d519e7089b44968a6bed8f39b8f7f67@o319543.ingest.sentry.io/5620232',
        environment: process.env.NODE_ENV,
        integrations: [
          // enable HTTP calls tracing
          new Sentry.Integrations.Http({ tracing: true }),
          // enable Express.js middleware tracing
          new Tracing.Integrations.Express({ app: this.app })
        ]
      })

      Sentry.configureScope(scope => {
        scope.setTag('project', 'Admin API')
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
        stream: fs.createWriteStream(http.logging.access, { flags: 'a' }),
      })
    );
    this.app.use(
      morgan('common', {
        // error log
        skip(req, res) {
          return res.statusCode < 400;
        },
        stream: fs.createWriteStream(http.logging.error, { flags: 'a' }),
      })
    );

    // Parse body to json
    this.app.use(bodyParser.json({ verify: rawBodyBuffer, limit: '50mb' }))

    // Cors setup
    this.app.use(cors({ exposedHeaders: 'Authorization' }));
    this.app.options('*', cors({ exposedHeaders: 'Authorization' }));

    //celebrate errors

    // Routing

    // Health Check for AWS
    this.app.get('/health', (req, res) => {
      return res.status(200).json({"message":"ok"})
    });

    this.app.use('/', authMiddleware)
    this.app.use('/', routes);

    this.app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


    this.app.use(errors({ statusCode: 400 }))

    return this;
  }
}

module.exports = new Http();
