import Redis from 'ioredis'
import config from '../../../config/redis'

export type RedisData = string | number | Array<any>

class RedisPlugin {
  client: Redis
  constructor() {
    this.client = new Redis(config)
  }

  public async get<T>(key: string): Promise<T> {
    const data = await this.client.get(key)

    if (!data) return null

    return this.parseToJson(data)
  }

  public set(key: string, data: RedisData) {
    return this.client.set(key, this.parseToString(data))

  }

  public del(key: string) {
    return this.client.del(key)
  }

  private parseToString(input: RedisData) {
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
