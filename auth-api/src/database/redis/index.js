const { RedisPlugin } = require('@mypharma/api-core')

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env

module.exports = {
  init() {
    return RedisPlugin.init({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD
    })
  }
}