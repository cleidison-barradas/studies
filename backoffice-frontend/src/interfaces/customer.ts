import publicAddress from './publicAddress'

export default interface Customer {
    _id?: string
    external_id?: string
    full_name: string
    email: string
    phone: string
    cpf: string
    status: boolean
    addresses: publicAddress[]
    createdAt?: Date
    updatedAt?: Date
}
