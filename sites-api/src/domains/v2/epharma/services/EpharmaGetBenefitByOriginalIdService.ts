import { Benefit, BenefitRepository } from '@mypharma/api-core'

interface RequestEpharmaGetBenefitByOriginalIdServiceDTO {
  tenant: string
  originalId: number
}

class EpharmaGetBenefitByOriginalIdService {

  constructor(private repository?: any) { }

  public async getBenefitByOriginalId({ tenant, originalId }: RequestEpharmaGetBenefitByOriginalIdServiceDTO) {
    let benefit = new Benefit()

    if (!this.repository) {

      benefit = await BenefitRepository.repo(tenant).findOne({
        where: {
          originalId
        }
      })
    }

    return benefit
  }
}

export default EpharmaGetBenefitByOriginalIdService
