/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Req,
  Res,
  Get,
  Put,
  Body,
  Post,
  Param,
  UseBefore,
  QueryParam,
  ApiRequest,
  JsonController,
  CustomerTenancyMiddleware,
} from '@mypharma/api-core'
import { Response } from 'express'

import PreAuthorizationMiddleware from '../../../middlewares/epharma/PreAuthorizationMiddleware'
import ElegibilityMiddleware from '../../../middlewares/epharma/ElegibilityMiddleware'

import {
  IRequestBodyRegisterMember,
  IBodyRequestPreAuthorization,
  IBodyRequestCustomerElegibility,
} from './interfaces'

import StoreGetByStoreIdService from '../store/services/StoreGetByStoreIdService'
import CartGetService from '../cart/services/CartGetService'

import EpharmaTransactionAuthorizeService from './services/EpharmaTransactionAuthorizeService'
import EpharmaBuildFieldsRegisterService from './services/EpharmaBuildFieldsRegisterService'
import EpharmaUpdateAuthorizationService from './services/EpharmaUpdateAuthorizationService'
import EpharmaElegibilityCustomerService from './services/EpharmaElegibiltyCustomerService'
import BenefitGetByBenefitIdService from '../benefit/services/BenefitGetByClientIdService'
import EpharmaGetAuthorizationService from './services/EpharmaGetAuthorizationService'
import EpharmaRegisterCustomerService from './services/EpharmaRegisterCustomerService'

@UseBefore(CustomerTenancyMiddleware)
@JsonController('/v2/pbm')
export class EpharmaController {

  private cartGetService: CartGetService
  private storeGetByStoreIdService: StoreGetByStoreIdService
  private benefitGetByBenefitIdService: BenefitGetByBenefitIdService
  private epharmaRegisterCustomerService: EpharmaRegisterCustomerService
  private epharmaGetAuthorizationService: EpharmaGetAuthorizationService
  private epharmaBuildFieldsRegisterService: EpharmaBuildFieldsRegisterService
  private epharmaElegibilityCustomerService: EpharmaElegibilityCustomerService
  private epharmaUpdateAuthorizationService: EpharmaUpdateAuthorizationService
  private epharmaTransactionAuthorizeService: EpharmaTransactionAuthorizeService

  constructor() {
    this.cartGetService = new CartGetService()
    this.storeGetByStoreIdService = new StoreGetByStoreIdService()
    this.benefitGetByBenefitIdService = new BenefitGetByBenefitIdService()
    this.epharmaRegisterCustomerService = new EpharmaRegisterCustomerService()
    this.epharmaGetAuthorizationService = new EpharmaGetAuthorizationService()
    this.epharmaElegibilityCustomerService = new EpharmaElegibilityCustomerService()
    this.epharmaUpdateAuthorizationService = new EpharmaUpdateAuthorizationService()
    this.epharmaBuildFieldsRegisterService = new EpharmaBuildFieldsRegisterService()
    this.epharmaTransactionAuthorizeService = new EpharmaTransactionAuthorizeService()
  }

  @Get('/authorization/:fingerprint')
  public async getAuthorizedProducts(
    @Res() response: Response,
    @Req() request: ApiRequest,
    @Param('fingerprint') fingerprint: string) {
    try {
      const { session: { store: storeId } } = request

      const authorization = await this.epharmaGetAuthorizationService.getAuthorization({ storeId, fingerprint })

      return response.json({
        authorization
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        authorization: null
      })
    }
  }

  @Put('/authorization/:ean/:fingerprint')
  public async removeProduct(
    @Res() response: Response,
    @Req() request: ApiRequest,
    @Param('ean') ean: string,
    @Param('fingerprint') fingerprint: string) {
    try {
      const { session: { store: storeId } } = request

      let authorization = await this.epharmaGetAuthorizationService.getAuthorization({ storeId, fingerprint })

      if (authorization) {

        authorization.productAuthorized = authorization.productAuthorized.filter(_p => _p.ean !== ean)

        authorization = await this.epharmaUpdateAuthorizationService.updateAuthorization({ authorization })
      }

      return response.json({
        authorization
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        authorization: null
      })
    }
  }

  @Post('/beneficiary/register/:benefitId')
  public async memberRegister(
    @Req() request: ApiRequest,
    @Res() response: Response,
    @Param('benefitId') benefitId: number,
    @Body() body: IRequestBodyRegisterMember) {
    try {
      const { session: { store: storeId } } = request
      const { fields, defaultFields = [], defaultQuiz = [] } = body

      const store = await this.storeGetByStoreIdService.getStoreByStoreId({ storeId })

      const register = await this.epharmaRegisterCustomerService.registerCustomer({ store, fields, defaultFields, defaultQuiz, benefitId })

      return response.json({
        register
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message
      })
    }
  }

  @Get('/beneficiary/register/configuration/:benefitId')
  public async memberRegisterConfiguration(
    @Req() request: ApiRequest,
    @Res() response: Response,
    @Param('benefitId') benefitId: number,
    @QueryParam('eans') eans: string[] = []) {
    try {
      const { session: { store: storeId } } = request

      const store = await this.storeGetByStoreIdService.getStoreByStoreId({ storeId })

      const {
        quiz,
        fields,
        defaultFields,
      } = await this.epharmaBuildFieldsRegisterService.fieldsRegisterConfiguration({ eans, store, benefitId })

      return response.json({
        quiz,
        fields,
        defaultFields
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        quiz: [],
        fields: []
      })
    }
  }

  @Post('/elegibility/:benefitId')
  @UseBefore(ElegibilityMiddleware)
  public async getElegibility(
    @Req() request: ApiRequest,
    @Res() response: Response,
    @Param('benefitId') benefitId: number,
    @Body() body: IBodyRequestCustomerElegibility) {

    try {
      const { session: { store: storeId }, tenant } = request
      const { identifyCustomer, fingerprint, ean } = body

      const store = await this.storeGetByStoreIdService.getStoreByStoreId({ storeId })

      const { allowCustomMembership, requiresMembership, clientId } = await this.benefitGetByBenefitIdService.getBenefitByBenefitId({ tenant, benefitId })

      const { authorization = null, needsDoctorData = false, needsRegister = false } = await this.epharmaElegibilityCustomerService.customerElegibility({
        ean,
        store,
        clientId,
        benefitId,
        fingerprint,
        identifyCustomer,
        requiresMembership,
        allowCustomMembership
      })

      return response.json({
        authorization,
        needsRegister,
        needsDoctorData,
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message
      })
    }
  }

  @Post('/preauthorization/:fingerprint')
  @UseBefore(PreAuthorizationMiddleware)
  public async preAuthorization(
    @Req() request: ApiRequest,
    @Res() response: Response,
    @Param('fingerprint') fingerprint: string,
    @Body() body: IBodyRequestPreAuthorization) {
    try {
      const { tenant, session: { store: storeId } } = request
      const { eans, prescriptor, elegibilityToken } = body

      const store = await this.storeGetByStoreIdService.getStoreByStoreId({ storeId })

      const cart = await this.cartGetService.execute({ storeId, fingerprint })

      const authorization = await this.epharmaTransactionAuthorizeService.transactionAuthorize({
        eans,
        cart,
        store,
        tenant,
        fingerprint,
        prescriptor,
        elegibilityToken
      })

      return response.json({
        authorization
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message
      })
    }
  }
}
