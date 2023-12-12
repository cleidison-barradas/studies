import { RedisPlugin, StoreRepository } from '@mypharma/api-core'

export async function getStore(id: string) {
  const cached = await RedisPlugin.get(`store:${id}`)

  if (cached) {
    return cached
  }

  const store = await StoreRepository.repo<StoreRepository>().findById(id)

  RedisPlugin.setWithExpire(`store:${id}`, store, 60 * 15)

  return store
}
