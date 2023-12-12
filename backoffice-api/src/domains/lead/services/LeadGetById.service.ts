import { ObjectID, Lead, LeadRepository } from '@mypharma/api-core'

export default async function getLeadByIdService(_id: ObjectID): Promise<Lead> {
  let lead = new Lead()

  lead = await LeadRepository.repo().findById(new ObjectID(_id))

  if (!lead) throw new Error('lead_not_found')

  return lead
}
