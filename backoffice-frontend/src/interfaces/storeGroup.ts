import Store from './store'

export default interface StoreGroup {
    _id?: string
    name: string
    stores: Store[]
    createdAt?: Date
    updatedAt?: Date
}
