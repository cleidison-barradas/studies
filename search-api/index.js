// Load envs
const env = require('dotenv').config()

// Avoid ElasticSearch TLS error
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

module.exports = (async () => {
  if (env.error) {
    throw env.error
  }

  return await require('./src/app')()
})()
