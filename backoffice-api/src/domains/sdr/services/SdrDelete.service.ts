import { ObjectID, SdrRepository } from '@mypharma/api-core'
import { DeleteWriteOpResultObject } from 'typeorm'

export default async function softDeleteSdrService(id: ObjectID): Promise<DeleteWriteOpResultObject> {
  const _id = new ObjectID(id)

  const deletedSdr = SdrRepository.repo().deleteOne({ _id })

  return deletedSdr
}
