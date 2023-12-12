import Neighborhood from "./neighborhood"

export default interface Address {
    _id?: string
    complement?: string
    neighborhood: Neighborhood
    notDeliverable?: boolean
    number?: string
    postcode?: string
    street?: string
    isMain?: boolean
    latitude?: number
    longitude?: number
}

export interface AddressCEP {
    _id?: string
    postcode: string
    street: string
    neighborhood: string
    number?: string
    state?: string
    city?: string
}