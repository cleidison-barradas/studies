import DeliveryFee from '../../interfaces/deliveryFee'
import { DeliverySchedule } from '../../interfaces/deliverySchedule'
import DistanceDeliveryFee from '../../interfaces/distanceDeliveryFee'
import Region from '../../interfaces/regions'

export interface DeliveryRegions {
  _id: string // the state name
  averageTime: number
  deliveryFees: DeliveryFee[]
}

export interface GetDeliveryRegions {
  regions: DeliveryRegions[]
}

export interface GetDistanceDeliveryRegions {
  regions: DistanceDeliveryFee[]
}

export interface GetRegions {
  regions: Region[]
}

export interface GetDeliveryScheduleResponse {
  schedule: DeliverySchedule[]
}
