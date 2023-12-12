// Libaries
const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const swaggerSchema = require('./api.schema.json');
const swaggerIU = require('swagger-ui-express');
// Routes
const v1 = require('./routes/v1');
const v2 = require('./routes/v2')
const v3 = require('./routes/v3')

class Http {
  constructor() {
    this.port = undefined;
    this.app = undefined;

    this.options = {};
  }

  configure(port = 80, options = {}) {
    this.port = port;
    this.options = options;
  }

  /**
   * 
   * @returns {Promise<number>} server port
   */
  init() {
    return new Promise((resolve, reject) => {
      if (this.port != undefined) {
        this.app = express();

        this.app.listen(this.port, '0.0.0.0', () => {
          // Setup our response headers
          this.app.use(cors({
            exposedHeaders: ['Authorization', 'store_token']
          }));
          this.app.options('*', cors());

          // Parse all requests body data to json
          this.app.use(bodyParser.json({ limit: "500mb" }));
          this.app.use(
            bodyParser.urlencoded({ extended: true, limit: "500mb" })
          );

          // Routing
          this.app.use('/v2', v2)
          this.app.use('/v3', v3)
          this.app.use('/health', async (req, res) => {
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
          // Listen for SSL
          if (
            this.options.ssl !== undefined &&
            this.options.ssl.port.length > 0
          ) {
            const { port, certificate, private_key } = this.options.ssl;

            https
              .createServer(
                {
                  cert: fs.readFileSync(certificate),
                  key: fs.readFileSync(private_key)
                },
                this.app
              )
              .listen(port);

            // Everything sounds fine!
            resolve(this.port + "," + port);
          } else {
            // Everything sounds fine!
            resolve(this.port);
          }
        });
      } else {
        reject('Please configure the HTTP server with "configure" method!');
      }

    });
  }
  async setUpDocs() {
    this.app.use('/docs', swaggerIU.serve, swaggerIU.setup(swaggerSchema));
  }
}

module.exports = new Http();
