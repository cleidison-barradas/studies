import { RedisPlugin, Store } from '@mypharma/api-core'
import axios, { AxiosInstance } from 'axios'
import epharmaConfig from '../config/epharma'
import {
  IAuthenticateResponse,
  IBenefitProductsResponse,
  RequestAuthenticateService,
  RequestBeneficiaryRegister,
  RequestAuthorizeTransaction,
  ResponseBeneficiaryRegister,
  ResponseAuthorizeTransaction,
  RequestBeneficiaryElegibility,
  ResponseBeneficiaryElegibility,
  RequestBeneficiaryRegisterConfig,
  RequestIndustryAssociatedProducts,
  ResponseBeneficiaryRegisterConfig,
  RequestBeneficiaryMemberElegibility,
  IBeneficiaryMemberElegibilityResponse,
} from './interfaces/epharma'

interface IEpharmaServiceOptions {
  store: Store
}

class EpharmaService {
  private cnpj: string
  private username: string
  private password: string
  private client_id: string
  private client: AxiosInstance

  /**
 * - Call this method before all methods to this class.
 * @param {IEpharmaServiceOptions}  - `store` - Get The username, password and client_id of the ePharma account
 */
  public config({ store }: IEpharmaServiceOptions) {

    const username = String(store.settings['config_epharma_username'])
    const password = String(store.settings['config_epharma_password'])
    const client_id = String(store.settings['config_epharma_clientId'])
    const cnpj = String(store.settings['config_epharma_master_cnpj']).replace(/[^0-9]+/g, '')

    if (!username || !password || !client_id || !cnpj) {

      throw Error('missing_epharma_credentials')
    }

    this.cnpj = cnpj
    this.username = username
    this.password = password
    this.client_id = client_id

    this.client = axios.create({
      baseURL: epharmaConfig.baseUrl
    })
  }

  /**
 * It will try to get the access token from the Redis cache, if it doesn't exist, it will call the API
 * to get it and then save it to the Redis cache
 * @param {RequestAuthenticateService}  - `storeId`: The store ID that you want to authenticate.
 * @returns The access token
 */
  public async authenticate({ storeId }: RequestAuthenticateService) {
    const redisKey = epharmaConfig.sessionKey.concat(storeId)

    let accessToken = await RedisPlugin.get(redisKey) as string

    if (!accessToken) {
      const { data } = await this.client.get<IAuthenticateResponse>('/authentication/api/v1/OAuth/Authenticate', {
        headers: {
          username: this.username,
          password: this.password,
          client_id: this.client_id
        }
      })

      if (data.error) {
        console.log(data)

        throw Error('error_on_authenticate_service')
      }

      accessToken = data.data.token.accessToken

      const expires = 60 * 120

      await RedisPlugin.setWithExpire(storeId, accessToken, expires)
    }

    return accessToken
  }

  public getIndustryAssociatedProducts({ accessToken, ean }: RequestIndustryAssociatedProducts) {

    return this.client.get<IBenefitProductsResponse>(`/Client/api/v1/Client/Industry/Associated/${this.cnpj}/${ean ? ean : ''}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }

  public async getBeneficiaryExists({ accessToken, benefitId, identifyCustomer, ean }: RequestBeneficiaryMemberElegibility) {

    return this.client.get<IBeneficiaryMemberElegibilityResponse>(`/Beneficiary/api/v1/Beneficiary/Membership/Exists/${benefitId}/${identifyCustomer}/${ean}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => response.data)
  }

  public async getBeneficiaryRegisterConfig({ accessToken, benefitId, eans }: RequestBeneficiaryRegisterConfig) {

    return this.client.get<ResponseBeneficiaryRegisterConfig>(`/Client/api/v1/Benefit/Beneficiary/Register/Configuration/${benefitId}?eans=${eans}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => response.data)
  }

  public async postBeneficiaryRegister({ accessToken, benefitId, fields, quiz }: RequestBeneficiaryRegister) {

    return this.client.post<ResponseBeneficiaryRegister>(`/Beneficiary/api/v1/Beneficiary/Dynamic/${benefitId}`, { fields, quiz }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => response.data)
  }

  public async getBeneficiaryElegibility({ accessToken, clientId, beneficiaryId }: RequestBeneficiaryElegibility) {

    return this.client.get<ResponseBeneficiaryElegibility>(`/beneficiary/api/v1/Beneficiary/Elegibility/${clientId}/${beneficiaryId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => response.data)

  }

  public async postAuthorizeTransaction({ accessToken, prescription, items, storeSequenceId, typeorigintransaction = 3, elegibilityToken }: RequestAuthorizeTransaction) {

    return this.client.post<ResponseAuthorizeTransaction>('/transaction/api/v1/Authorization', {
      items,
      prescription,
      storeSequenceId,
      storeCnpj: this.cnpj,
      typeorigintransaction,
    }, {
      headers: {
        elegibilityToken,
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => response.data)
  }
}

export default EpharmaService
