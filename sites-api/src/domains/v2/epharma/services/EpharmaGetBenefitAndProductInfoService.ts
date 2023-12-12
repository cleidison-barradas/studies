import { IBenefit } from '../../../../adapters/interfaces/epharma'

interface BenefitResponse {
  benefit: IBenefit
}

interface RequestEpharmaGetBenefitAndProductInfoServiceDTO {
  ean: string
  benefitId: number
  benefits: BenefitResponse[]
}

class EpharmaGetBenefitAndProductInfoService {
  constructor(private repository?: any) { }

  public getVBenefitAndProductInfo({ benefitId, ean, benefits }: RequestEpharmaGetBenefitAndProductInfoServiceDTO) {

    if (benefits.length > 0) {
      const benefit = benefits.find(b => b.benefit.id === benefitId)

      if (!benefit) {

        throw Error('benefit_not_found')
      }

      const benefitProduct = benefit.benefit.products.find(p => p.ean.includes(ean))

      if (!benefitProduct) {

        throw Error('benefit_product_not_found')
      }

      return {
        benefit,
        benefitProduct
      }
    }

    return null
  }
}

export default EpharmaGetBenefitAndProductInfoService
