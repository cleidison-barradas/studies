import { PublicAddress } from './publicAddress'

export default interface Customer {
    _id?: string
    external_id?: string
    fullName: string
    firstname: string
    lastname: string
    email: string
    phone: string
    cpf: string
    status: boolean
    addresses: PublicAddress[]
    createdAt?: Date
    updatedAt?: Date
}
