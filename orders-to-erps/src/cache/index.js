const { logger, colors } = require('@mypharma/api-core')
const Redis = require('../services/redis')
const moment = require('moment')

/**
 * 
 * @param {BaseRepository<T>} repository 
 * @param {string} tenant 
 * @param {number} originalId 
 * @returns {Promise<BaseRepository<T>>}
 */
const GenericCache = async (repository, tenant, originalId) => {
  const redisKey = `${repository.metadata.targetName}_${tenant}_${originalId}`
  let data = await Redis.get(redisKey)

  if (!data) {
    data = await repository.findByOriginalId(originalId)

    if (!data) return null
    
    logger(`Caching ${redisKey}`, colors.FgCyan)
    const expireAt = moment().add(1, 'hours').unix()

    await Redis.set(redisKey, data)
    await Redis.expireAt(redisKey, expireAt)
  }

  return data
}

module.exports = GenericCache