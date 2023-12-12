import { Address, AddressRepository, City, CityRepository, DeliveryFeeRepository, GenericObject, Neighborhood, NeighborhoodRepository } from '@mypharma/api-core'
import axios from 'axios'
import { ObjectId } from 'bson'
import { normalizeStr } from '../../../helpers/normalizeString'
import { addCustomerAddress, deleteCustomerAddress } from '../../../support/services/CustomerService'
import { getCustomer } from '../customer/customer.service'
const { GEAOAPIFY_KEY } = process.env

export function getAddress(tenant: string, id: string) {
  return AddressRepository.repo<AddressRepository>(tenant).findById(id)
}

export function putAddress(tenant: string, address: Partial<Address>) {
  return AddressRepository.repo<AddressRepository>(tenant).createDoc(address)
}

export function deleteAddress(tenant: string, _id: string) {
  return AddressRepository.repo<AddressRepository>(tenant).findOneAndDelete({ _id: new ObjectId(_id) })
}

export function postAddress(tenant: string, id: string, address: Partial<Address>) {
  return AddressRepository.repo<AddressRepository>(tenant).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        _id: new ObjectId(id),
        ...address
      }
    })
}
export function getNeighborhood(masterTenant: string, _id: any) {
  return NeighborhoodRepository.repo<NeighborhoodRepository>(masterTenant).findById(_id)
}

export function deletedAddress(tenant: string, _id: string) {
  return AddressRepository.repo<AddressRepository>(tenant).deleteOne({ _id: new ObjectId(_id.toString()) })
}

export async function getNeighborhoodByName(tenant: string, neighborhood: Neighborhood) {
  const data = await DeliveryFeeRepository.repo<DeliveryFeeRepository>(tenant).find({
    select: ['neighborhood']
  })

  return data.find(
    (value) =>
      normalizeStr(value.neighborhood.name).toLowerCase() === normalizeStr(neighborhood.name).toLowerCase() &&
      normalizeStr(value.neighborhood.city.name).toLowerCase() === normalizeStr(neighborhood.city.name).toLowerCase() &&
      normalizeStr(value.neighborhood.city.state.name).toLowerCase() === normalizeStr(neighborhood.city.state.name).toLowerCase()
  )
}

export function UpdateAddress(tenant: string, id: string, data: Partial<Address>) {
  return AddressRepository.repo<AddressRepository>(tenant).findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data })
}


export async function findCity(city: City) {
  return CityRepository.repo().findOne({ where: { name: new RegExp(normalizeStr(city.name), 'gi'), state: new RegExp(normalizeStr(city.state.name), 'gi') } })
}

export async function saveCity(city: City) {
  return CityRepository.repo().save(city)
}

export async function saveNeighbood(neighborhood: Neighborhood) {
  let city = await findCity(neighborhood.city)
  if (!city) city = await saveCity(neighborhood.city)

  return NeighborhoodRepository.repo().save({
    ...neighborhood,
    city,
  })
}

export async function getAddressGeocode(postalCode: string, street: string, number: number, neighborhood: Neighborhood) {
  try {
    const { city, name } = neighborhood
    let cityParam = ''
    let streetParam = ''
    let url = ''

    if (city && city.name) {
      cityParam = `&city=${encodeURIComponent(city.name)}`
    }

    if (name && street) {
      streetParam = `&street=${encodeURIComponent(street + ', ' + name)}`
    }

    if (postalCode && cityParam.length > 0 && streetParam.length > 0 && number && street) {
      url = `https://api.geoapify.com/v1/geocode/search?housenumber=${encodeURIComponent(number)}${streetParam}&postcode=${encodeURIComponent(postalCode)}${cityParam}&country=Brasil&format=json&apiKey=${GEAOAPIFY_KEY}`
    }

    if (url && url.length > 0) {
      const response = await axios.get(url)
      return response.data
    }
    else return null
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function putAddressesGeocode(tenant, customerId, addresses) {
  for (const Address of addresses) {
    if (!Address.latitude || !Address.longitude) {
      const { street, complement, number, postcode = '', neighborhood, isMain } = Address
      const addressGeoInfo = await getAddressGeocode(postcode, street, number, neighborhood)

      const addressInfo = { street, complement, number, postcode, neighborhood, isMain }
      if (addressGeoInfo && addressGeoInfo.results.length > 0) {
        if (addressGeoInfo.results[0].lat && addressGeoInfo.results[0].lon) {
          addressInfo['latitude'] = addressGeoInfo.results[0].lat
          addressInfo['longitude'] = addressGeoInfo.results[0].lon
        }
        else {
          addressInfo['latitude'] = 0
          addressInfo['longitude'] = 0
        }
      }
      const customer = await getCustomer(tenant, customerId)
      await deleteCustomerAddress(tenant, customer._id, Address._id.toString())

      const address = await putAddress(tenant, addressInfo)
      await addCustomerAddress(tenant, customer._id, address)
    }
  }
}