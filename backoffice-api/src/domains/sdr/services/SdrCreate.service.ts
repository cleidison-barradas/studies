import { Sdr, SdrRepository } from '@mypharma/api-core'
import { IPostSdrRequest } from '../interfaces/sdr.request'

export default async function createSdrService(SdrRequestObj: IPostSdrRequest): Promise<Sdr> {
  SdrRequestObj.email = SdrRequestObj.email.replace(/\s+/g, '')
  SdrRequestObj.createdAt = new Date()
  SdrRequestObj.updatedAt = new Date()

  return await SdrRepository.repo().createDoc(SdrRequestObj)
}
