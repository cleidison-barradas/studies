import { RedisPlugin } from "@mypharma/api-core"
import epharmaConfig from "../../../../config/epharma"
import { IEpharmaAuthorizationDataKeys } from "../../../../interfaces/epharma"

interface EpharmaCacheAuthorizationServiceDTO {
  fingerprint: string
}

class EpharmaCacheAuthorizationService {
  constructor(private repository?: any) { }

  public async getCacheAuthorization({ fingerprint }: EpharmaCacheAuthorizationServiceDTO) {
    const redisKey = epharmaConfig.authorizationkey.concat(fingerprint)

    const data: IEpharmaAuthorizationDataKeys | null = await RedisPlugin.get(redisKey)

    if (!data) {

      throw new Error('epharma_authoriztion_not_found')
    }

    return data
  }
}

export default EpharmaCacheAuthorizationService