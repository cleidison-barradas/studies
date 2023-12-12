import IORedis from 'ioredis'
import { Redis } from 'ioredis'
import { captureException, withScope } from '@sentry/node'
import config from '../../../config/redis'

class RedisClient {
  private client: Redis

  constructor() {
    this.client = new IORedis(config)
  }

  public async set(key: string, data: any) {
    try {
      await this.client.set(key, this.parseToString(data))
      return true
    } catch (err) {
      withScope(scope => {
        scope.setExtra('REDIS SET', JSON.stringify(err))
        captureException(err)
      })

      return false
    }
  }

  public async push(key: string, data: any) {
    try {
      await this.client.rpush(key, this.parseToString(data))
      return true
    } catch (err) {
      withScope(scope => {
        scope.setExtra('REDIS PUSH', JSON.stringify(err))
        captureException(err)
      })

      return false
    }
  }

  public async get(key: string) {
    try {
      const data = await this.client.get(key)
      return this.parseToJson(data)
    } catch {
      return null
    }
  }

  public async remove(key: string) {
    try {
      await this.client.del(key)
      return true
    } catch (err) {
      withScope(scope => {
        scope.setExtra('REDIS REMOVE', JSON.stringify(err))
        captureException(err)
      })

      return false
    }
  }

  public async exists(key: string) {
    try {
      const exists = await this.client.exists(key)
      return exists > 0 ? true : false
    } catch {
      return false
    }
  }

  public async expireAt(key: string, expireAt: number) {
    try {
      return this.client.expireat(key, expireAt)
    } catch (error) {
      console.log(error)
    }
  }

  private parseToJson(input: any) {
    try {
      return JSON.parse(input)
    } catch {
      return null
    }
  }

  private parseToString(input: any) {
    return JSON.stringify(input)
  }
}

export default new RedisClient()
