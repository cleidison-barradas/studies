import { ObjectID, LeadRepository, ILeadStatus } from '@mypharma/api-core'
import { UpdateWriteOpResult } from 'typeorm'

export default async function updateLeadStatusService(_id: ObjectID, status: ILeadStatus): Promise<UpdateWriteOpResult | boolean> {
  const currentLead = await LeadRepository.repo().findOne({ _id: new ObjectID(_id)})

  if (currentLead.status !== status) {
    const newStatusHistory = {
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return await LeadRepository.repo().updateOne({_id: new ObjectID(_id)}, {$set: {status: status}, $push: {statusHistory: newStatusHistory}})
  }

  return true
}
