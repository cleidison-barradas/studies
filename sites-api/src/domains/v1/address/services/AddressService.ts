import {
  Address,
  AddressRepository,
  NeighborhoodRepository,
} from '@mypharma/api-core'
import { ObjectId } from 'bson'

export function getAddress(tenant: string, id: string) {
  return AddressRepository.repo<AddressRepository>(tenant).findById(id)
}

export function putAddress(tenant: string, address: Partial<Address>) {
  return AddressRepository.repo<AddressRepository>(tenant).save(address)
}

export function deleteAddress(tenant: string, _id: string) {
  return AddressRepository.repo<AddressRepository>(tenant).softDelete({ _id })
}

export function getNeighborhood(masterTenant: string, _id: any) {
  return NeighborhoodRepository.repo<NeighborhoodRepository>(
    masterTenant
  ).findById(_id)
}

export function UpdateAddress(tenant: string, id: string, data: Partial<Address>) {
  return AddressRepository.repo<AddressRepository>(tenant).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { _id: new ObjectId(id), ...data } },
  ) 
}
