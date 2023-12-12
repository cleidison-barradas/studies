import { BaseModel, BaseRepository } from '@mypharma/api-core'
import RedisPlugin from '../plugins/redis'
import moment from 'moment'

export async function GenericCache<T extends BaseModel>(repository: BaseRepository<T>, storeTenant: string, originalId: number): Promise<T> {
  const redisKey = `${repository.metadata.targetName}_${storeTenant}_${originalId}`

  let data = await RedisPlugin.get<any>(redisKey)

  if (!data) {
    data = await repository.findByOriginalId(originalId)

    if (!data) return null

    console.log(`Caching ${redisKey}`)
    const expireAt = moment().add(3, 'hours').unix()

    await RedisPlugin.set(redisKey, data)
    await RedisPlugin.expireAt(redisKey, expireAt)
  }

  return data as T
}
