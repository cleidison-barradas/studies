export default interface IPutAddressRequest {
  assign: boolean
  neighborhood: any
  street: string
  complement: string
  number: number
  postcode: string
  isMain?: boolean
}