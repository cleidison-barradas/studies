/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pmc, PmcRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

interface PmcGetByPmcIdServiceDTO {
  pmcId?: string
}

class PmcGetByPmcIdService {
  constructor(private repository?: any) { }

  public async getPmcByPmcId({ pmcId }: PmcGetByPmcIdServiceDTO) {

    if (!pmcId) return null

    let pmc = new Pmc()

    pmc = await PmcRepository.repo().findById(new ObjectId(pmcId))

    if (!pmc) {

      throw new Error('pmc_not_found')
    }

    return pmc
  }
}

export default PmcGetByPmcIdService