import { IBenefit, IBenefitProducts } from '../../interfaces/epharma'
import { PBMAuthorization } from '../../interfaces/pbmAuthorization'

export interface ResponseBeneficiaryProductInfo {
  benefit: IBenefit
  benefitProduct: IBenefitProducts
}

export interface ResponseBeneficiaryElegibility {
  product: boolean
  membership: boolean
}

export interface ResponseBeneficiaryElegibility {
  product: boolean
  membership: boolean
}

export interface ResponseAuthorization {
  error?: string
  authorization: PBMAuthorization
}

export interface ResponseMemberRegister {
  error?: string
  success: boolean
}
