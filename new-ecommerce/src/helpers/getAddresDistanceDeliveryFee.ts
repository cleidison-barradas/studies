import DistanceDeliveryFee from "../interfaces/distanceDeliveryFee"
import Store from "../interfaces/store"
import { GetDistanceDeliveryRegions } from "../services/delivery/response.interface"
import { getDistanceBetweenCoordinates } from "./getDistanceBetweenCoordinates"

export interface Coordinate {
    latitude: number
    longitude: number
  }

  export function getAddresDistanceDeliveryFee(
    distanceDeliveryRegions: GetDistanceDeliveryRegions | undefined,
    store: Store | null,
    checkoutAddress: Coordinate,
  ): DistanceDeliveryFee[] | DistanceDeliveryFee | null {

    if (distanceDeliveryRegions) {
      const storeLocation: Coordinate = {
        latitude: store?.settings.config_address_latitude ?? 0,
        longitude: store?.settings.config_address_longitude ?? 0,
      }

      const customerLocation: Coordinate = {
        latitude: checkoutAddress.latitude ?? 0,
        longitude: checkoutAddress.longitude ?? 0,
      }

      const customerToStoreDistance =  Math.round(getDistanceBetweenCoordinates(
        storeLocation,
        customerLocation
      ) * 1000)

      if (customerToStoreDistance !== 0) {
        let selectedRegion: DistanceDeliveryFee | null = null
        let selectedDistance: number = Infinity

        for (const region of distanceDeliveryRegions.regions) {
          const regionDistance = region.distance
          if (
            customerToStoreDistance < regionDistance &&
            regionDistance < selectedDistance
          ) {
            selectedDistance = regionDistance
            selectedRegion = region
          }
        }

        if (selectedRegion && selectedDistance !== Infinity) {
          return selectedRegion
        }
      }

      return distanceDeliveryRegions.regions
    }

    return null
  }
