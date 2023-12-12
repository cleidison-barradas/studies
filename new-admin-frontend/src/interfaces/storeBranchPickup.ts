import { PublicAddress, PublicAddressForm } from './publicAddress'

export interface StoreBranchPickup {
  _id: string
  name: string
  address: PublicAddress
}

export interface StoreBranchPickupForm {
  name: string
  address: PublicAddressForm
}
