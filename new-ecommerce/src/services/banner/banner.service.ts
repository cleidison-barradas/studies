import { siteApi } from '../../config/api'
import { GetBannerResponse } from './response.interface'

export async function getBanner() {
  return siteApi.get<GetBannerResponse>('/v2/banner').then((res) => res.data)
}
