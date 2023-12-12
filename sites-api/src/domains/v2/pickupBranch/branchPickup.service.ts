import { StoreBranchPickupRepository } from '@mypharma/api-core'

export async function getBranchPickupService(tenant: string) {
  const branchesPrickup = await StoreBranchPickupRepository.repo(tenant).find()
  return branchesPrickup
}
