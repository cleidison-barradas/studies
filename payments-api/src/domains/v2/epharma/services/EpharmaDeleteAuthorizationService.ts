import { ObjectID, PbmAuthorizationRepository } from '@mypharma/api-core'

interface EpharmaDeleteAuthorizationServiceDTO {
  authorizationId?: string
}

class EpharmaDeleteAuthorizationService {

  public async deleteAuthorization({ authorizationId }: EpharmaDeleteAuthorizationServiceDTO) {

    if (authorizationId) {

      await PbmAuthorizationRepository.repo().deleteOne({ _id: new ObjectID(authorizationId) })
    }
  }

}

export default EpharmaDeleteAuthorizationService