import { BenefitProduct, BenefitProductRepository } from '@mypharma/api-core'

interface RequestEpharmaGetBenefitProductsEansServiceDTO {
  tenant: string
  eans: string[]
}

class EpharmaGetBenefitProductsEansService {
  constructor(private repository?: any) { }

  public async getBenefitProductsByEans({ tenant, eans }: RequestEpharmaGetBenefitProductsEansServiceDTO) {
    let benefitProduct: BenefitProduct[] = []

    if (!this.repository) {

      benefitProduct = await BenefitProductRepository.repo(tenant).find({
        where: {
          ean: { $in: eans }
        }
      })
    }

    return benefitProduct
  }
}

export default EpharmaGetBenefitProductsEansService
