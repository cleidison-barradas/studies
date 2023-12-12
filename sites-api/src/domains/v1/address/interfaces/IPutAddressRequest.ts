export default interface IPutAddressRequest {
  address_id?: string
  city?: string
  number: number
  street: string
  country?: string
  postcode: string
  lastname: string
  firstname: string
  complement: string
  addressType: string
  neighborhood?: string
  state_address?: string
  neighborhood_id: string
  not_deliverable: boolean
}
