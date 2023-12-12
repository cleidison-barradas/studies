export default interface User {
  _id?: string
  firstname: string
  lastname: string
  fullName: string
  password: string
  telephone: string
  email: string
  cpf?: string
  status: boolean
  createdAt: Date
  updatedAt: Date
  customer_id: string
  error?: string
}
