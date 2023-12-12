import Store from './store'

export default interface StoreGroups {
  _id?: string
  stores: Store[]
  name: string
  updatedAt?: Date
  createdAt?: Date
  __v?: number
}
