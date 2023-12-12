import { siteApi } from '../../config/api'
import { ResponseBeneficiaryRegisterConfigFields } from '../../interfaces/epharma'
import {
  RequestAuthorization,
  RequestCustomerElegibility,
  ResponseCustomerElegibility,
  RequestUpdateAuthorization,
  RequestCustomerPreAuthorization,
  RequestBeneficiaryMemberRegister,
  RequestBeneficiaryRegisterConfig,
} from './request.interface'
import { ResponseAuthorization, ResponseMemberRegister } from './response.interface'

export async function postMemberRegister({ benefitId, fields, eans, defaultFields, defaultQuiz }: RequestBeneficiaryMemberRegister) {

  return siteApi.post<ResponseMemberRegister>(`/v2/pbm/beneficiary/register/${benefitId}`, { fields, eans, defaultFields, defaultQuiz }).then(response => response.data)
}

export async function getMemberRegisterConfiguration({ benefitId, eans }: RequestBeneficiaryRegisterConfig) {

  return siteApi.get<ResponseBeneficiaryRegisterConfigFields>(`/v2/pbm/beneficiary/register/configuration/${benefitId}`, { eans }).then(response => response.data)
}

export async function postCustomerElegibility({ ean, benefitId, identifyCustomer, fingerprint }: RequestCustomerElegibility) {

  return siteApi.post<ResponseCustomerElegibility>(`/v2/pbm/elegibility/${benefitId}`, { ean, identifyCustomer, fingerprint }).then(response => response.data)
}

export async function postCustomerPreAuthorization({ eans, fingerprint, prescriptor, elegibilityToken }: RequestCustomerPreAuthorization) {

  return siteApi
    .post<ResponseAuthorization>(`/v2/pbm/preauthorization/${fingerprint}`, {
      eans,
      prescriptor,
      elegibilityToken
    })
    .then(response => response.data)
}

export async function getPBMAuthorization({ fingerprint }: RequestAuthorization) {

  return siteApi.get<ResponseAuthorization>(`/v2/pbm/authorization/${fingerprint}`).then(response => response.data)
}

export async function putPBMAuthorization({ ean, fingerprint }: RequestUpdateAuthorization) {

  return siteApi.put<ResponseAuthorization>(`/v2/pbm/authorization/${ean}/${fingerprint}`).then(response => response.data)
}
