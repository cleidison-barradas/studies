import { PbmAuthorization, PbmAuthorizationRepository } from '@mypharma/api-core'
import { AuthorizedTransactionItems } from '../../../../adapters/interfaces/epharma'

interface EpharmaCreateAuthorizationServiceDTO {
  storeId: string
  fingerprint: string
  elegibilityToken: string
  tokenExpirationDate?: string
  authorizationId: number | null
  productAuthorized: AuthorizedTransactionItems[]
}

class EpharmaCreateAuthorizationService {

  public async createAuthorization({ storeId, fingerprint, elegibilityToken, authorizationId, tokenExpirationDate, productAuthorized = [] }: EpharmaCreateAuthorizationServiceDTO) {
    let authorization = new PbmAuthorization()

    authorization._id = undefined
    authorization.storeId = storeId
    authorization.prescriptor = null
    authorization.fingerprint = fingerprint
    authorization.authorizationId = authorizationId
    authorization.elegibilityToken = elegibilityToken
    authorization.tokenExpirationDate = tokenExpirationDate
    authorization.productAuthorized = productAuthorized
    authorization.createdAt = new Date()

    authorization = await PbmAuthorizationRepository.repo().createDoc(authorization)

    return authorization
  }
}

export default EpharmaCreateAuthorizationService
