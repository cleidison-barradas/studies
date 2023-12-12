import Address from '../interfaces/address'
import DeliveryFee from '../interfaces/deliveryFee'
import { DeliveryRegions, GetDeliveryRegions } from '../services/delivery/response.interface'

export function getExpensiveRegion({ regions }: GetDeliveryRegions, address?: Address) {
  const deliveryFees: DeliveryFee[] = []

  regions.map((value) => value.deliveryFees.map((deliveryFee) => deliveryFees.push(deliveryFee)))

  const data = deliveryFees
    .filter((fee) => fee.freeFrom > 0)
    .sort((a, b) => a.freeFrom - b.freeFrom)
    .shift()

  const userAddress = deliveryFees.find(
    (region) => region.neighborhood._id === (address?.neighborhood?._id as string)
  )

  return data || userAddress || deliveryFees![0]
}

export function getCheapestRegion({ regions }: GetDeliveryRegions) {
  const deliveryFees: DeliveryFee[] = []
  regions.map((value) => value.deliveryFees.map((deliveryFee) => deliveryFees.push(deliveryFee)))

  deliveryFees.sort((a, b) => (a.freeFrom > b.freeFrom ? 1 : -1))
  return deliveryFees.shift()
}

export function getCheapeastNeighborhood(region: DeliveryRegions) {
  return region.deliveryFees
    .map((value) => value)
    .sort((a, b) => a.feePrice - b.feePrice)
    .shift()
}

export function getExpensiveMinimumPurchaseNeighborhood(region: DeliveryRegions) {
  return region.deliveryFees
    .map((value) => value)
    .sort((a, b) => (a.minimumPurchase < b.minimumPurchase ? 1 : -1))
    .shift()
}