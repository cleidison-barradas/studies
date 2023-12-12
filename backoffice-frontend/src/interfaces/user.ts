import Store from './store'

export default interface User {
    _id?: string
    userName: string
    password: string
    email: string
    role: 'admin' | 'store' | 'support'
    status: 'active' | 'disabled'
    store: Store[]
    updatedAt?: Date
    createdAt?: Date
}
