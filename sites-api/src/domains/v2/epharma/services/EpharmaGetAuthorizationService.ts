import { PbmAuthorizationRepository } from '@mypharma/api-core'
import * as moment from 'moment'

interface EpharmaGetAuthorizationServiceDTO {
  storeId: string
  fingerprint: string
}

class EpharmaGetAuthorizationService {

  public async getAuthorization({ storeId, fingerprint }: EpharmaGetAuthorizationServiceDTO) {

    let authorization = await PbmAuthorizationRepository.repo().findOne({
      where: { storeId, fingerprint }
    })

    if (authorization) {
      if (!moment().isSameOrBefore(authorization.tokenExpirationDate)) {

        await PbmAuthorizationRepository.repo().deleteOne({ fingerprint })

        authorization = null
      }
    }

    return authorization
  }
}

export default EpharmaGetAuthorizationService
