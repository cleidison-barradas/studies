import { ObjectID, PbmAuthorization, PbmAuthorizationRepository } from '@mypharma/api-core'

interface EpharmaUpdateAuthorizationServiceDTO {
  authorization: PbmAuthorization
}

class EpharmaUpdateAuthorizationService {
  constructor(private repository?: any) { }

  public async updateAuthorization({ authorization }: EpharmaUpdateAuthorizationServiceDTO) {
    const _id = new ObjectID(authorization._id)
    delete authorization._id
    authorization.updatedAt = new Date()

    await PbmAuthorizationRepository.repo().updateOne({ _id }, { $set: { ...authorization } })

    return PbmAuthorizationRepository.repo().findById(_id)

  }
}
export default EpharmaUpdateAuthorizationService
