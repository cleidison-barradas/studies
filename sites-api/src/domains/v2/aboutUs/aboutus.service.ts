import { AboutUsRepository } from '@mypharma/api-core'

export function GetAboutUs(tenant: string) {
  return AboutUsRepository.repo<AboutUsRepository>(tenant).findOne({
    where: { published: true },
  })
}
