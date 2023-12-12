/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import XLSX from 'xlsx-js-style'
import {
  Put,
  Res,
  Get,
  Body,
  Post,
  Param,
  Delete,
  Params,
  UseBefore,
  QueryParam,
  QueryParams,
  JsonController,
  AuthHandlerMiddleware,
} from '@mypharma/api-core'
import { Response } from 'express'

import {
  IGetStoreReportRequest,
  IGetStoresRequest,
  IPostStoreRequest,
  IPutStoreRequest,
  IGetGMVReportRequest
} from './interfaces/store.request'

import { generateReport } from './services/StoreGenerateReportService'
import { put } from '../../services/aws'
import { getStoreByOrder } from './services/StoreGetByOrderService'
import { getStoresByCreatedAt } from './services/StoreGetByCreatedAtService'

import PmcGetByPmcIdService from '../pmc/services/PmcGetByPmcIdService'
import PlanGetByPlanIdService from '../plan/services/PlanGetByPlaIdService'

import StoreCreateService from './services/StoreCreateService'
import StoreUpdateService from './services/StoreUpdateService'
import StoreGetReportService from './services/StoreGetReportService'
import StoreDeleteStoreService from './services/StoreDeleteStoreService'
import StoreValidateUrlService from './services/StoreValidateUrlService'
import StoreGetByStoreIdService from './services/StoreGetByStoreIdService'
import StoreCountByTenantService from './services/StoreCountByTenantService'
import StoreGenerateTenantService from './services/StoreGenerateTenantService'
import StoreCountByOriginaldService from './services/StoreCountByOriginaldService'
import StoreFilterStoreByQueryService from './services/StoreFilterStoreByQueryService'
import UpdateMainStoreService from './services/StoreUpdateMainStore'

import GMVGetTotalService from './services/GMVGetTotalService'
import { getRandomOriginalId } from './helpers/GetRandomOriginalId'
import StoreGetAffiliateStoreService from './services/StoreGetAffiliateStoreService'

@JsonController('/v1/store')
@UseBefore(AuthHandlerMiddleware)
export class StoreController {

  private StoreCreateService: StoreCreateService
  private StoreUpdateService: StoreUpdateService
  private GMVGetTotalService: GMVGetTotalService
  private PmcGetByPmcIdService: PmcGetByPmcIdService
  private StoreGetReportService: StoreGetReportService
  private PlanGetByPlanIdService: PlanGetByPlanIdService
  private StoreDeleteStoreService: StoreDeleteStoreService
  private StoreValidateUrlService: StoreValidateUrlService
  private StoreGetByStoreIdService: StoreGetByStoreIdService
  private StoreCountByTenantService: StoreCountByTenantService
  private StoreGenerateTenantService: StoreGenerateTenantService
  private StoreCountByOriginaldService: StoreCountByOriginaldService
  private StoreFilterStoreByQueryService: StoreFilterStoreByQueryService
  private UpdateMainStoreService: UpdateMainStoreService
  private StoreGetAffiliateStoreService: StoreGetAffiliateStoreService

  constructor() {
    this.StoreCreateService = new StoreCreateService()
    this.StoreUpdateService = new StoreUpdateService()
    this.GMVGetTotalService = new GMVGetTotalService()
    this.PmcGetByPmcIdService = new PmcGetByPmcIdService()
    this.PlanGetByPlanIdService = new PlanGetByPlanIdService()

    this.StoreGetReportService = new StoreGetReportService()
    this.StoreDeleteStoreService = new StoreDeleteStoreService()
    this.StoreValidateUrlService = new StoreValidateUrlService()
    this.StoreGetByStoreIdService = new StoreGetByStoreIdService()
    this.StoreCountByTenantService = new StoreCountByTenantService()
    this.StoreGenerateTenantService = new StoreGenerateTenantService()
    this.StoreCountByOriginaldService = new StoreCountByOriginaldService()
    this.StoreFilterStoreByQueryService = new StoreFilterStoreByQueryService()

    this.UpdateMainStoreService = new UpdateMainStoreService()
    this.StoreGetAffiliateStoreService = new StoreGetAffiliateStoreService()
  }

  @Get('/:storeId?')
  async storeDetail(@Res() response: Response, @Params() { storeId = null }: { storeId: string }, @QueryParams() query: IGetStoresRequest) {
    try {
      const { page = 1, limit = 20, name, startDate, endDate, mainStore = false } = query

      if (storeId) {
        const store = await this.StoreGetByStoreIdService.getStoreByStoreId({ storeId })

        return response.json({
          store
        })
      }

      const { stores, total } = await this.StoreFilterStoreByQueryService.getStoreByFilterQuery({ page, limit, name, startDate, endDate, mainStore })

      return response.json({
        total,
        stores,
        limit: Number(limit),
        currentPage: Number(page)
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message
      })
    }
  }

  @Post('/reportgmv')
  async getReportGMV(@Res() response: Response, @QueryParams() query: IGetGMVReportRequest) {
    try {
      const { origin = '', startDate = null, endDate = null } = query

      await this.GMVGetTotalService.getGMVTotal({ origin, startDate, endDate })

      return response.json({
        ok: true
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message
      })
    }
  }

  @Post('/getreportgmv')
  async getReportGMVFile(@Res() response: Response, @QueryParams() query: IGetGMVReportRequest) {
    try {
      const { origin = '', startDate = null, endDate = null } = query

      await this.GMVGetTotalService.getGMVTotal({ origin, startDate, endDate })

      return response.json({
        ok: true
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message
      })

    }
  }

  @Get('/report/gmv')
  async getStoreReport(@Res() response: Response, @QueryParam('data') data: any) {
    try {

      const key = `${process.env.GMV_REPORT_FILE}`

      const report = await this.StoreGetReportService.getStoreGmv({ key })

      return response.json({
        report
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message
      })
    }
  }

  @Post('/report')
  async getReport(@Res() response: Response, @QueryParams() query: IGetStoreReportRequest) {
    const { orderLimit = null, startDate = null, endDate = null } = query

    try {
      const stores = await getStoresByCreatedAt(startDate, endDate)
      const storesOrderNumbers = await getStoreByOrder(stores, orderLimit)

      if (storesOrderNumbers.size > 0) {
        const workbook = await generateReport(storesOrderNumbers, stores, orderLimit, startDate, endDate)
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

        const { Location: report } = await put(`backoffice/store_reports/Relatório de Lojas.xlsx`, {
          content: buffer,
          name: 'Relatório de Lojas',
          type: 'xlsx',
          url: 'backoffice/store_reports/Relatório de Loja.xlsx'
        })

        return response.json({
          report
        })
      } else {
        return response.status(400).json({
          error: 'not_have_stores_with_these_proprieties'
        })
      }

    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }

  @Put('/')
  async createStore(@Res() response: Response, @Body() body: IPutStoreRequest) {
    try {
      const { store } = body

      const originalId = getRandomOriginalId(1000, 100000)

      const originalIdCounted = await this.StoreCountByOriginaldService.getCountStoreByOriginalId({ originalId })

      if (originalIdCounted > 0) {

        throw new Error('originalId_already_exists')
      }

      const { url, count: urlCounted } = await this.StoreValidateUrlService.validateStoreUrl({ url: store.url })

      if (urlCounted > 0) {

        throw new Error('url_already_exists')
      }

      const tenant = this.StoreGenerateTenantService.generateTenantStore({ url: store.url })

      const tenantCounted = await this.StoreCountByTenantService.getCountStoreByTenant({ tenant })

      if (tenantCounted > 0) {

        throw new Error('tenant_already_exists')
      }

      const pmcId = store.pmc ? store.pmc._id.toString() : null

      const planId = store.plan ? store.plan._id.toString() : null

      const pmc = await this.PmcGetByPmcIdService.getPmcByPmcId({ pmcId })

      const plan = await this.PlanGetByPlanIdService.getPlanByPlanId({ planId })

      const { name, settings, mainStore } = store

      const newStore = await this.StoreCreateService.createStore({
        pmc,
        url,
        plan,
        name,
        tenant,
        settings,
        mainStore,
        originalId,
      })

      return response.status(201).json({
        store: newStore
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message
      })
    }
  }

  @Post('/:storeId')
  async updateStore(@Param('storeId') storeId: string, @Res() response: Response, @Body() body: IPostStoreRequest) {
    try {

      const { url = null, name, mainStore, settings } = body.store
      let pmc = body.store.pmc
      let plan = body.store.plan

      let store = await this.StoreGetByStoreIdService.getStoreByStoreId({ storeId })

      const pmcId = pmc ? pmc._id.toString() : null

      const planId = plan ? plan._id.toString() : null

      pmc = await this.PmcGetByPmcIdService.getPmcByPmcId({ pmcId })

      plan = await this.PlanGetByPlanIdService.getPlanByPlanId({ planId })

      const validate = await this.StoreValidateUrlService.validateStoreUrl({ url, storeId })

      if (validate.count > 0) {

        throw new Error('url_already_exists')
      }

      store = await this.StoreUpdateService.updateStore({ url: validate.url, storeId, name, settings, pmc, plan, mainStore })

      return response.json({
        store
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message
      })
    }
  }


  @Put('/mainstore/:storeId')
  async mainStore(@Param('storeId') storeId: string, @Res() response: Response, @Body() body: IPutStoreRequest) {
    try {

      const affiliateStores = await this.StoreGetAffiliateStoreService.getAffiliateStores({ affiliateStores: body.store.affiliateStores })

      const store = await this.UpdateMainStoreService.updateMainStore({ storeId, affiliateStores })

      return response.json({
        store

      })

    } catch (error) {
      console.log(error.message)
      return response.status(500).json({
        error: error.message
      })
    }
  }

  @Delete('/:storeId')
  async softDeleteStore(@Res() response: Response, @Param('storeId') storeId: string) {
    try {

      const store = await this.StoreGetByStoreIdService.getStoreByStoreId({ storeId })

      const tenant = store.tenant

      const deletedId = await this.StoreDeleteStoreService.deleteStore({ storeId, tenant })

      return response.json({
        deletedId
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message
      })
    }
  }
}
