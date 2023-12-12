const { RedisPlugin, colors, logger } = require('@mypharma/api-core')
const moment = require('moment')
const { isDev } = require('myp-admin/utils')

/**
 * > It takes a redis key, a tenant, and some data, and returns the data if it's cached, or caches the
 * data and returns it if it's not
 * @param {String} redisKey - The key to store the data in redis
 * @param [data=null] - The data to be cached
 * @returns The data is being returned.
 */
const GenericCache = async (redisKey, data = null) => {
  const cached = await RedisPlugin.get(redisKey) || null

  if (cached) {

    return cached
  }

  const seconds = isDev() ? 60 * 1 : 60 * 15

  await RedisPlugin.setWithExpire(redisKey, data, seconds)
  logger(`caching_data_until_${moment(moment().add(seconds, 'seconds')).format('DD-MM-YYYY:HH:mm:ss')}`, colors.FgYellow)

  return data
}

module.exports = GenericCache