import Address from '../../interfaces/address'
import Neighborhood from '../../interfaces/neighborhood'

export interface GetAddresses {
  addresses: Address[]
}

export interface SearchAddressResponse {
  neighborhood: Neighborhood[]
}

export interface GetAddressByPostcodeResponse {
  address: {
    city: string
    state: string
    uf: string
    street: string
    neighborhood: string
  }
}
