export interface PostcodeService {
  getAddressByPostcode: (postcode: string) => Promise<GetAddressByPostcodeResponse>
}

export interface GetAddressByPostcodeResponse {
  city: string
  state: string
  uf: string
  neighborhood: string
}
