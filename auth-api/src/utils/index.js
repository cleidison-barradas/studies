const logger = require('./logger');
const constants = require('./constants');
const isDev = require('./isDevelopment')

// Exports all utils
module.exports = {
  isDev,
  logger,
  constants,
};
