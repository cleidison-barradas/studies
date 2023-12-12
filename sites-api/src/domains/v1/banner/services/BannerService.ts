import { BannerRepository } from '@mypharma/api-core'

export function GetBanners(tenant: string) {
  return BannerRepository.repo<BannerRepository>(tenant).find({})
}
