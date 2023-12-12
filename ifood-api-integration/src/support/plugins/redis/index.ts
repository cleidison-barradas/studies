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

  /**
   * It gets the data from the cache, parses it to JSON, and returns it
   * @param {string} key - The key of the data you want to retrieve.
   * @returns The data is being returned as a JSON object.
   */
  public async get<T>(key: string) {
    const data = await this.client.get(key)

    if (!data) return null

    return this.parseToJson(data) as T
  }

  /**
   * It takes a key and a data object, and then it sets the key to the data object
   * @param {string} key - The key to store the data under.
   * @param {RedisData} data - RedisData
   * @returns A promise that resolves to a string.
   */
  public set(key: string, data: RedisData) {
    return this.client.set(key, this.parseToString(data))

  }

  /**
   * It deletes a key from the cache
   * @param {string} key - The key of the item you want to delete
   * @returns A boolean value.
   */
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

