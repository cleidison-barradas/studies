import { siteApi } from '../../config/api'
import { GetBranchesPickup } from './response.interface'

export async function getBranchesPickup() {
  return siteApi.get<GetBranchesPickup>('/v2/pickupBranch/').then((res) => res.data)
}
