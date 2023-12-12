import { BenefitProduct, BenefitProductRepository } from '@mypharma/api-core'

interface RequestEpharmaGetBenefitProductEanServiceDTO {
  tenant: string
  ean: string
}

class EpharmaGetBenefitProductEanService {
  constructor(private repository?: any) { }

  public async getBenefitProductByEan({ tenant, ean }: RequestEpharmaGetBenefitProductEanServiceDTO) {
    let benefitProduct = new BenefitProduct()

    if (!this.repository) {

      benefitProduct = await BenefitProductRepository.repo(tenant).findOne({
        where: {
          ean
        }
      })
    }

    return benefitProduct

  }
}

export default EpharmaGetBenefitProductEanService
