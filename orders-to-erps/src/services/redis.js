const IORedis = require('ioredis')
const config = require('../config/redis')

class RedisPlugin {
  constructor() {
    this.client = new IORedis(config)
  }

  set(key, data) {
    return this.client.set(key, this.parseToString(data))
  }

  async get(key) {
    try {
      const data = await this.client.get(key)

      return this.parseToJson(data)

    } catch (err) {
      console.log(err)
      return null
    }
  }

  async hset(key, data) {
    try {

      await this.client.mset(key, this.parseHashToString(data))
    } catch (err) {
      console.log(err)
    }
  }

  async exists(key) {
    try {
      const exists = await this.client.exists(key)
      return exists > 0 ? true : false
    } catch {
      return false
    }
  }

  async hget(key) {
    try {
      const data = await this.client.hgetall(key)

      return this.parseHashToObject(data)
    } catch (error) {
      console.log(error)
      return null
    }
  }

  /**
   * @param {string} key 
   * @param {number} expireAt 
   */
  expireAt(key, expireAt) {
    return this.client.expireat(key, expireAt)
  }

  async delete(key) {
    return this.client.del(key)
  }

  parseToString(input) {
    return JSON.stringify(input)
  }

  /**
   * @param {string} input 
   */
  parseToJson(input) {
    if (typeof input !== 'string') return input

    try {
      return JSON.parse(input)
    } catch {
      return null
    }
  }

  parseHashToString(input) {
    const obj = Object.assign({}, input)

    Object.keys(obj).forEach(k => {
      const value = obj[k]

      if (typeof value === 'object') {
        obj[k] = this.parseToString(value)
      }
    })

    return obj
  }

  parseHashToObject(input) {
    const obj = Object.assign({}, input)

    Object.keys(obj).forEach(k => {
      const value = obj[k]
      if (value.includes('{') || value.includes('[')) {
        obj[k] = this.parseToJson(value)
      }
      if (!isNaN(value)) {
        obj[k] = Number(value)
      }
      if (value === 'null') {
        obj[k] = null
      }
      if (value === 'true' || value === 'false') {
        obj[k] = value === 'true'
      }
    })

    return Object.keys(obj).length === 0 ? null : obj
  }
}

module.exports = new RedisPlugin()