import City from './city'

export default interface Neighborhood {
    _id?: string
    name: string
    city: City
    createdAt?: Date
    updatedAt?: Date
}
