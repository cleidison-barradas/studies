import City from './city'

export interface Neighborhood {
    _id?: string
    name: string
    city: City
    createdAt?: Date
    updatedAt?: Date
}

export interface NeighborhoodForm {
    name: string
    city: {
        name: string
        state: {
            name: string
            code?: string
        }
    }
}
