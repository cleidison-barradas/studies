import Neighborhood from './neighborhood'

export default interface PublicAddress {
    _id: string
    street: string
    number: number
    complement: string
    neighborhood: Neighborhood
    updatedAt: Date
    createdAt: Date
}
