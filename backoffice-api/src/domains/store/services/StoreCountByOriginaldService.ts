/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StoreRepository } from '@mypharma/api-core'

interface StoreCountByOriginaldServiceDTO {
  originalId: number
}

class StoreCountByOriginaldService {
  constructor(private repository?: any) { }

  public async getCountStoreByOriginalId({ originalId }: StoreCountByOriginaldServiceDTO) {

    return StoreRepository.repo().count({ originalId })
  }
}

export default StoreCountByOriginaldService