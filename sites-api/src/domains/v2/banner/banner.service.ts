import { BannerRepository, RedisPlugin } from '@mypharma/api-core'

export async function GetBanners(tenant: string) {
  const cached = await RedisPlugin.get(`banners:${tenant}`)
  if (cached) {
    // return cached
  }

  const banners = await BannerRepository.repo<BannerRepository>(tenant).find({})

  RedisPlugin.setWithExpire(`banners:${tenant}`, banners, 60 * 10)

  return banners
}
