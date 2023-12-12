import { SdrRepository } from '@mypharma/api-core'

export default async function validateSdrService(email: string): Promise<number> {
  email = email.replace(/\s+/g, '')

  return SdrRepository.repo().count({ email })
}
