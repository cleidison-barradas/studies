import { DistanceDeliveryFee, DistanceDeliveryFeeRepository } from "@mypharma/api-core"
import { DistanceDeliveryFeeServiceRepository } from "../../../../repositories/internals"
import { getDistanceBetweenCoordinates } from "../../../../helpers/getDistanceBetweenCoordinates"

interface Coordinate {
  latitude: number
  longitude: number
}

interface RequestDeliveryGetFeeByDistanceServiceDTO {
  tenant: string
  storeCoordinates: Coordinate
  customerCoordinates: Coordinate
}

class DeliveryGetFeeByDistanceService {
  constructor(private repository?: DistanceDeliveryFeeServiceRepository) {}

  public async getDeliveryFeeByDistance({ tenant, storeCoordinates, customerCoordinates }: RequestDeliveryGetFeeByDistanceServiceDTO) {
    const distanceDeliveryFees = await DistanceDeliveryFeeRepository.repo(tenant).find()

    if (distanceDeliveryFees && distanceDeliveryFees.length > 0) {
      const customerToStoreDistance = Math.round(getDistanceBetweenCoordinates(storeCoordinates, customerCoordinates)*1000)

      if (customerToStoreDistance && customerToStoreDistance !== 0) {
        let selectedRegion: DistanceDeliveryFee | null = null
        let selectedDistance: number = Infinity

        for (const region of distanceDeliveryFees) {
          const regionDistance = region.distance
          if (customerToStoreDistance < regionDistance && regionDistance < selectedDistance) {
            selectedDistance = regionDistance
            selectedRegion = region
          }
        }
        if (selectedRegion && selectedDistance !== Infinity) {
          return selectedRegion
        }
      }
    }

    throw new Error("distance_delivery_fee_not_found")
  }
}

export default DeliveryGetFeeByDistanceService
