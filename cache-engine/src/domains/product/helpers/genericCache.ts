import { BaseModel, BaseRepository } from "@mypharma/api-core";
import { RedisPlugin } from "@mypharma/etl-engine";

export async function GenericCache<T extends BaseModel>(repository: BaseRepository<T>, storeTenant: string, originalId: number): Promise<T> {
  const redisKey = `${repository.metadata.targetName}_${storeTenant}_${originalId}`

  let data = await RedisPlugin.get(redisKey)

  if (!data) {

    data = await repository.findByOriginalId(originalId)

    if (!data) return null

    console.log(`Caching ${redisKey}`)

    await RedisPlugin.set(redisKey, data)

    await RedisPlugin.expireAt(redisKey, 60 * 15)

  }

  return data as T
}