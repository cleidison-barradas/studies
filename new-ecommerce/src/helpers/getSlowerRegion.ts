import { GetDeliveryRegions } from '../services/delivery/response.interface'

export function getSlowerRegion({ regions }: GetDeliveryRegions) {
  const sorted = [...regions].sort((a, b) => (a.averageTime < b.averageTime ? 1 : -1))
  return sorted.shift()
}
