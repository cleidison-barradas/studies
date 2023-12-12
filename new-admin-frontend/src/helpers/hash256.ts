import { createHmac } from 'crypto'
import { CustomerxHash } from '../config'

export default function hash256(client: string, email: string) {
  const key = CustomerxHash
  const value = `${client}:${email}`
  const sha256 = createHmac('SHA256', key).update(value).digest('base64')

  return sha256
}
