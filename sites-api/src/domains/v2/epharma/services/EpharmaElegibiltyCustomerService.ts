import { Store } from '@mypharma/api-core'
import EpharmaService from '../../../../adapters/EpharmaService'
import { IResponseCustomerElegibility } from '../interfaces'

import EpharmaGetAuthorizationService from './EpharmaGetAuthorizationService'
import EpharmaCreateAuthorizationService from './EpharmaCreateAuthorizationService'
import EpharmaUpdateAuthorizationService from './EpharmaUpdateAuthorizationService'

interface EpharmaElegibilityCustomerServiceDTO {
  ean: string
  store: Store
  clientId: number
  benefitId: number,
  fingerprint: string
  identifyCustomer: string
  requiresMembership: boolean
  allowCustomMembership: boolean
}

class EpharmaElegibilityCustomerService {
  private epharmaService: EpharmaService
  private epharmaGetAuthorizationService: EpharmaGetAuthorizationService
  private epharmaCreateAuthorizationService: EpharmaCreateAuthorizationService
  private epharmaUpdateAuthorizationService: EpharmaUpdateAuthorizationService

  constructor(private respository?: any) {

    this.epharmaService = new EpharmaService()
    this.epharmaGetAuthorizationService = new EpharmaGetAuthorizationService()
    this.epharmaCreateAuthorizationService = new EpharmaCreateAuthorizationService()
    this.epharmaUpdateAuthorizationService = new EpharmaUpdateAuthorizationService()
  }

  public async customerElegibility({
    ean,
    store,
    clientId,
    benefitId,
    fingerprint,
    identifyCustomer,
    requiresMembership = false,
    allowCustomMembership = false }: EpharmaElegibilityCustomerServiceDTO) {

    const storeId = store._id.toString()
    identifyCustomer = identifyCustomer.replace(/[^0-9]+/g, '')

    const elegibilityCustomer: IResponseCustomerElegibility = {
      needsRegister: false,
      elegibilityToken: null,
      needsDoctorData: false,
      tokenExpirationDate: null
    }

    this.epharmaService.config({ store })

    const accessToken = await this.epharmaService.authenticate({ storeId })

    if (requiresMembership) {

      if (allowCustomMembership) {

        const beneficiaryExists = await this.epharmaService.getBeneficiaryExists({ accessToken, benefitId, identifyCustomer, ean })

        if (beneficiaryExists.error || !beneficiaryExists.data.membership) {

          elegibilityCustomer.needsRegister = true

        } else {

          const elegibilityResponse = await this.epharmaService.getBeneficiaryElegibility({ accessToken, clientId, fingerprint, beneficiaryId: identifyCustomer })

          if (elegibilityResponse.error) {
            console.log(elegibilityResponse)

            elegibilityCustomer.error = elegibilityResponse.error

            if (elegibilityResponse.error.code === 404) {

              elegibilityCustomer.needsRegister = true
            }

          } else {
            const { data } = elegibilityResponse

            elegibilityCustomer.needsDoctorData = true
            elegibilityCustomer.elegibilityToken = data.token
            elegibilityCustomer.tokenExpirationDate = data.tokenExpirationDate
          }
        }

      } else {

        const elegibilityResponse = await this.epharmaService.getBeneficiaryElegibility({ accessToken, clientId, fingerprint, beneficiaryId: identifyCustomer })

        if (elegibilityResponse.error) {
          console.log(elegibilityResponse)
          elegibilityCustomer.error = elegibilityResponse.error

          if (elegibilityResponse.error.code === 404) {

            elegibilityCustomer.needsRegister = true
          }

        } else {
          const { data } = elegibilityResponse

          elegibilityCustomer.needsDoctorData = true
          elegibilityCustomer.elegibilityToken = data.token
          elegibilityCustomer.tokenExpirationDate = data.tokenExpirationDate
        }
      }

    } else {

      const elegibilityResponse = await this.epharmaService.getBeneficiaryElegibility({ accessToken, clientId, fingerprint, beneficiaryId: identifyCustomer })

      if (elegibilityResponse.error) {
        console.log(elegibilityResponse)

        elegibilityCustomer.error = elegibilityResponse.error

        if (elegibilityResponse.error.code === 404) {

          elegibilityCustomer.needsRegister = true
        }

      } else {
        const { data } = elegibilityResponse

        elegibilityCustomer.needsDoctorData = true
        elegibilityCustomer.elegibilityToken = data.token
        elegibilityCustomer.tokenExpirationDate = data.tokenExpirationDate
      }
    }

    if (elegibilityCustomer.elegibilityToken) {
      let authorization = await this.epharmaGetAuthorizationService.getAuthorization({ storeId, fingerprint })

      if (!authorization) {

        authorization = await this.epharmaCreateAuthorizationService.createAuthorization({
          storeId,
          fingerprint,
          authorizationId: null,
          productAuthorized: [],
          ...elegibilityCustomer
        })
      }

      authorization.elegibilityToken = elegibilityCustomer.elegibilityToken
      authorization.tokenExpirationDate = elegibilityCustomer.tokenExpirationDate

      authorization = await this.epharmaUpdateAuthorizationService.updateAuthorization({ authorization })

      delete elegibilityCustomer.elegibilityToken
      delete elegibilityCustomer.tokenExpirationDate

      return {
        authorization,
        ...elegibilityCustomer
      }

    }

    return {
      authorization: null,
      ...elegibilityCustomer
    }
  }
}

export default EpharmaElegibilityCustomerService

