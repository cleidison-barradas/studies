import { BenefitRepository, Benefit } from '@mypharma/api-core'

interface RequestBenefitGetByBenefitIdServiceDTO {
  tenant: string
  benefitId: number
}

class BenefitGetByBenefitIdService {
  constructor(private repository?: any) { }

  public async getBenefitByBenefitId({ tenant, benefitId }: RequestBenefitGetByBenefitIdServiceDTO) {
    let benefit = new Benefit()

    if (!this.repository) {
      benefit = await BenefitRepository.repo(tenant).findOne({
        where: {
          originalId: benefitId
        }
      })
    }

    if (!benefit) {

      throw Error('benefit_not_found')
    }

    return benefit
  }
}

export default BenefitGetByBenefitIdService
