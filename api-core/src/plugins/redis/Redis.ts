import IORedis from 'ioredis'
import { Redis as Client, RedisOptions } from 'ioredis'
import { GenericObject } from '../../interfaces/generics/GenericObject'
export { RedisOptions } from 'ioredis'

export type RedisData = GenericObject | GenericObject[] | string | number

class RedisClient {
  private client: Client

  public init(options: RedisOptions) {
    this.client = new IORedis(options)
  }

  public set(key: string, data: RedisData) {
    return this.client.set(key, this.parseToString(data))
  }

  public setWithExpire(key: string, data: RedisData,expire : number){
    return this.client.set(key, this.parseToString(data),'EX',expire)
  }

  public async push(key: string, data: RedisData, expireAt?: number) {
    try {
      if (data instanceof Array) {
        // Push entire new array with pipeline
        const pipeline = this.client.pipeline()
        data.forEach(item => pipeline.rpush(key, this.parseToString(item)))

        // Run pipeline
        await pipeline.exec()
      } else {
        await this.client.rpush(key, this.parseToString(data))
      }

      if (expireAt && expireAt > 60) {
        await this.expireAt(key, expireAt)
      }
      return true
    } catch {
      return false
    }
  }

  public async get(key: string, start?: number, end?: number) {
    try {
      if (start === undefined) {
        const data = await this.client.get(key)
        return this.parseToJson(data)
      } else {
        const data = await this.client.lrange(key, start, end || -1)
        return this.parseListToJson(data)
      }
    } catch (err) {
      console.log(key, start, end)
      console.log(err)
      return null
    }
  }

  public async remove(key: string) {
    try {
      await this.client.del(key)
      return true
    } catch {
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

  /**
   * public hset(key: string, data: Map<RedisData, RedisData>) {
    return this.client.hset(key, this.parseHashToString(data))
  }
   */

  public async hexists(key: string, field: string) {
    try {
      const exists = await this.client.hexists(key, field)
      return exists > 0 ? true : false
    } catch {
      return false
    }
  } 

  public async hget(key: string, field: string | null = null) {
    try {
      if (field) {
        const data = await this.client.hget(key, field)
        return this.parseHashToObject(data)
      } else {
        const data = await this.client.hgetall(key)
        return this.parseHashToObject(data)
      }
    } catch {
      return null
    }
  }

  public expireAt(key: string, expireAt: number) {
    return this.client.expireat(key, expireAt)
  }

  public persist(key: string) {
    return this.client.persist(key)
  }

  private parseToJson(input: string) {
    if (typeof input !== 'string') return input

    try {
      return JSON.parse(input)
    } catch {
      return null
    }
  }

  private parseListToJson(list: Array<string>) {
    return list.map(item => this.parseToJson(item))
  }

  private parseToString(input: RedisData) {
    return JSON.stringify(input)
  }

  private parseHashToString(input: RedisData) {
    Object.keys(input).forEach(k => {
      const value = input[k]
      if (typeof value === 'object') {
        input[k] = this.parseToString(value)
      }
    })

    return input
  }

  private parseHashToObject(input: RedisData) {
    Object.keys(input).forEach(k => {
      const value = input[k] as string
      if (value.includes('{') || value.includes('[')) {
        input[k] = this.parseToJson(value)
      }
    })

    return Object.keys(input).length === 0 ? null : input
  }
}

export const RedisPlugin = new RedisClient()
