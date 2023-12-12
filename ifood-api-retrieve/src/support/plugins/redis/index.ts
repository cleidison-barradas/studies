import Redis, { Redis as Client, RedisOptions } from 'ioredis'

export type RedisData = string | number | Array<any> | Record<any, any>

class RedisPlugin {
  private client: Client

  public init(opts: RedisOptions): Promise<Number> {
    return new Promise((resolve) => {
      this.client = new Redis(opts)
      resolve(opts.port)
    })
  }

  public async get(key: string) {
    const data = await this.client.get(key)

    if (!data) return null

    return this.parseToJson(data)
  }

  public set(key: string, data: RedisData) {
    return this.client.set(key, this.parseToString(data))

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

