import Customer from './customer'
import { Neighborhood, NeighborhoodForm } from './neighborhood'

export interface PublicAddress {
  _id: string
  customer: Customer
  street: string
  number?: number
  complement: string
  neighborhood: Neighborhood
  notDeliverable: boolean
  postcode: string
  addressType: string
}

export type PublicAddressForm = {
  street: string
  number?: number
  complement: string
  postcode: string
  neighborhood: NeighborhoodForm
}
