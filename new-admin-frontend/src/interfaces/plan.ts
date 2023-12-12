import Permission from './permission'

export default interface Plan {
  name: string
  description: string
  price: number
  rule: string
  permissions: Permission
}