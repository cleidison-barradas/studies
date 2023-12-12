import State from './state'

export default interface City {
    _id?: string
    name: string
    state: State
    createdAt?: Date
    updatedAt?: Date
}
