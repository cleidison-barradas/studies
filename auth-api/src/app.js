// Database - aws
const { Mongo,Redis } = require('./database');

// HTTP
const HTTP = require('./http');

// Redis

// Services
const Services = require('./services');

// Utils
const {
  logger,
  constants: { Color },
} = require('./utils');

/**
 * Initialization singleton
 */
const init = async () => {
  try {
    // Initialize Mongo database
    await Mongo.init();
    Redis.init()

    // Initialize services
    await Services.init();

    // Initialize HTTP server
    HTTP.init();

    logger('API initialized!', Color.FgGreen);
  } catch (error) {
    logger(error, Color.FgRed);
  }
};

/**
 * Defaut export
 */
module.exports = async () => {
  await init();
};
