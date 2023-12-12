import RedisClient from 'ioredis'
import redisConfig from '../../../config/redis'

class RedisPlugin {
  private client: RedisClient

  constructor() {
    this.init()
  }

  public init() {
    this.client = new RedisClient(redisConfig)
  }

  public async get<T>(key: string): Promise<T> {
    const data = await this.client.get(key)

    return this.parseToJson(data)
  }

  public set<T>(key: string, data: T) {

    return this.client.set(key, this.parseToString<T>(data))
  }

  public async delete(key: string) {
    try {
      await this.client.del(key)

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  private parseToString<T>(input: T) {
    return JSON.stringify(input)

  }

  private parseToJson(input: string) {
    if (typeof input !== 'string') return input

    try {
      return JSON.parse(input)
    } catch {
      return null
    }
  }

  public expireAt(key: string, expireAt: number) {
    return this.client.expireat(key, expireAt)
  }
}

export default new RedisPlugin()