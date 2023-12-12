import Country from './country'

export default interface State {
    _id?: string
    name: string
    country: Country
    createdAt?: Date
    updatedAt?: Date
}
