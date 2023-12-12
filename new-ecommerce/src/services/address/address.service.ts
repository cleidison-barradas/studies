import { siteApi, searchApi } from '../../config/api'
import { PutAddress } from './request.interface'
import { GetAddressByPostcodeResponse, GetAddresses, SearchAddressResponse } from './response.interface'

export async function getAddresses() {
  return siteApi.get<GetAddresses>('/v2/address/').then((res) => res.data)
}

export async function saveAddress(data: PutAddress) {
  return siteApi.put<GetAddresses>(`/v2/address/`, data)
}

export async function deleteAddress(addressId: string) {
  return siteApi.delete(`/v2/address/${addressId}`).then((res) => res.data)
}

export async function searchAddress(address: string) {
  return searchApi.post<SearchAddressResponse>(`/address`, { address }).then((res) => res.data)
}

export async function getAddressByPostcode(postcode: string) {
  return siteApi.get<GetAddressByPostcodeResponse>(`/v2/address/cep/${postcode}`)
}
