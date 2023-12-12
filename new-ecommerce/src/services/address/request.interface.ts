import Neighborhood from '../../interfaces/neighborhood'

export interface PutAddress {
  street: string
  number: string
  complement?: string
  postcode: string
  neighborhood: Neighborhood
  isMain: boolean
  id?: string
}
