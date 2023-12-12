import { BaseModel, BaseRepository } from '@mypharma/api-core'
import { RedisPlugin } from '@mypharma/etl-engine'
import moment from 'moment'

export async function GenericCache<T extends BaseModel>(repository: BaseRepository<T>, storeTenant: string, originalId: number): Promise<T> {
  const redisKey = `${repository.metadata.targetName}_${storeTenant}_${originalId}`

  let data = await RedisPlugin.get(redisKey)
  if (!data) {
    data = await repository.findByOriginalId(originalId)

    console.log(`Caching ${redisKey}`)
    const expireAt = moment().add(3, 'hours').unix()

    await RedisPlugin.set(redisKey, data)
    await RedisPlugin.expireAt(redisKey, expireAt)
  }

  return data as T
}
