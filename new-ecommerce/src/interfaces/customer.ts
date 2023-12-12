import Address from './address'

export default interface Customer {
  _id?: string,
  fullName: string,
  firstname: string,
  lastname: string,
  email: string,
  phone: string,
  cpf: string,
  status: boolean,
  addresses: Address[],
  createdAt?: Date,
  updatedAt?: Date,
}