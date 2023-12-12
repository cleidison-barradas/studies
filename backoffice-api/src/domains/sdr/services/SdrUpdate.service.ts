import { ObjectID, SdrRepository } from '@mypharma/api-core'
import { UpdateWriteOpResult } from 'typeorm'

export default async function updateSdrService( _id: ObjectID, name: string, email: string, willReceveLeadsEmail: boolean): Promise<UpdateWriteOpResult> {

  const currentSdr = await SdrRepository.repo().findOne({ _id: new ObjectID(_id) })

  currentSdr._id = new ObjectID(_id)

  if (currentSdr.email !== email) {
    currentSdr.email = email
  }

  if (currentSdr.name !== name) {
    currentSdr.name = name
  }

  if (currentSdr.willReceveLeadsEmail !== willReceveLeadsEmail) {
    currentSdr.willReceveLeadsEmail = willReceveLeadsEmail
  }

  return await SdrRepository.repo().updateOne({_id: currentSdr._id}, {$set: currentSdr})
}
