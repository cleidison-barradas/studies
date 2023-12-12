import { ObjectID, LeadRepository } from '@mypharma/api-core'
import { DeleteWriteOpResultObject } from 'typeorm'

export default async function softDeleteLeadService(id: ObjectID): Promise<DeleteWriteOpResultObject> {
  return await LeadRepository.repo().deleteOne({ _id: new ObjectID(id) })
}
