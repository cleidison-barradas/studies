import Store from './store'

export interface Billboard {
    _id?: string
    message: string
    title: string
    stores: Store[] | Store['_id'][]
    type: 'warning' | 'info' | 'danger'
    active: boolean
    startAt: Date
    endAt: Date
    createdAt?: Date
    updatedAt?: Date
}
