import { ObjectID, Sdr, SdrRepository } from '@mypharma/api-core'

export default async function getSdrByIdService(_id: ObjectID): Promise<Sdr> {
  let sdr = new Sdr()

  sdr = await SdrRepository.repo().findById(new ObjectID(_id))

  if (!sdr) throw new Error('sdr_not_found')

  return sdr
}
