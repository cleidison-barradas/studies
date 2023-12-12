import { siteApi } from '../../config/api'
import { AddressCEP } from '../../interfaces/address'
import { GetDeliveryRegions, GetDeliveryScheduleResponse, GetDistanceDeliveryRegions, GetRegions } from './response.interface'

export async function getDeliveryRegions() {
  return siteApi.get<GetDeliveryRegions>('/v2/delivery/deliveryFees').then((res) => res.data)
}

export async function getDistanceDeliveryRegions() {
  return siteApi.get<GetDistanceDeliveryRegions>('/v2/delivery/distanceDeliveryFees').then((res) => res.data)
}

export async function getRegions(neighborhood?: string) {
  return siteApi.get<GetRegions>(`/v2/delivery/regions/${neighborhood}`).then((res) => res.data)
}

export async function getAddressInfoByCEP(cep: number) {
  return siteApi.get<AddressCEP>(`/v2/delivery/${cep}`).then((res) => res.data)
}
export async function getDeliverySchedule() {
  return siteApi.get<GetDeliveryScheduleResponse>('/v2/delivery/schedule')
}
