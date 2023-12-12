import multer from "multer"
import moment from "moment"
import { Response } from 'express'
import {
  Res,
  Put,
  Req,
  Post,
  Body,
  UseBefore,
  ApiRequest,
  JsonController,
  AuthHandlerMiddleware,
} from "@mypharma/api-core"

import {
  QueuePlugin
} from "../../../../support/plugins/queues"

import { filterValidUrls } from "../helpers/filterStoreUrl"
import uploadConfig from '../../../../helpers/upload'
import removeFile from "../../../../helpers/removeFile"
import RedisPlugin from "../../../../support/plugins/redis"
import { RequestImportPMCBody, RequestUpdatePMCValues, RequestUploadPromotionBody } from "../interfaces/request";

import UploadGetPMCSevice from '../services/UploadGetPMCService'

import CreateImportCustomerService from "../services/CreateImportCustomerService";
import UploadGetProductXlsDataService from "../services/UploadGetProductXlsDataService";

import StoreGetStoreByUrlService from "../../../v1/store/services/StoreGetStoreByUrlService";

import UploadGetPromotionXlsDataService from "../services/UploadGetPromotionXlsDataService";
import ImportHistoryCreateService from '../../importHistory/services/ImportHistoryCreateService'
import ImportHistoryCountService from "../../importHistory/services/ImportHistoryCountService";

const uploadGetPMCSevice = new UploadGetPMCSevice()

const storeGetStoreByUrlService = new StoreGetStoreByUrlService()

const ImportCustomerService = new CreateImportCustomerService()
const importHistoryCountService = new ImportHistoryCountService()
const importHistoryCreateService = new ImportHistoryCreateService()
const uploadGetProductXlsDataService = new UploadGetProductXlsDataService()
const uploadGetPromotionXlsDataService = new UploadGetPromotionXlsDataService()

const upload = multer(uploadConfig)

@JsonController('/v1/upload')
@UseBefore(AuthHandlerMiddleware)
export class UpLoadController {
  @Post('/products')
  @UseBefore(upload.single('products'))
  public async uploadProduct(@Req() request: ApiRequest, @Res() response: Response) {
    try {
      const { tenant } = request

      if (!request.file) {
        return response.status(400).json({
          error: 'missing_field_file'
        })
      }

      const filePath = request.file.path
      const fileName = request.file.filename

      const importInProgress = await importHistoryCountService.execute({ tenant, status: 'pending', module: 'product' })

      if (importInProgress > 0) {

        throw new Error('import_in_progress')
      }

      const { redisKey, products = [] } = await uploadGetProductXlsDataService.getProductXlsData({ filePath, tenant })

      const total = products.length

      const inserted = await RedisPlugin.set(redisKey, products)

      if (inserted.includes('OK')) {
        const importResponse = await importHistoryCreateService.execute({
          total,
          tenant,
          path: filePath,
          title: fileName,
          module: 'product',
          createdAt: new Date()
        })

        if (importResponse) {
          const importId = importResponse._id.toString()
          const expiresAt = moment().add('1', 'hour').unix()

          await QueuePlugin.publish('handle-import-product', { redisKey, action: 'product', tenant, importId })
          await RedisPlugin.expireAt(redisKey, expiresAt)

          removeFile(filePath)
        }
      }

      return response.json({
        total,
        redisKey
      })

    } catch (error) {
      console.log(error)
      removeFile(request.file.path)
      return response.status(500).json({
        error: error.message
      })
    }
  }

  @Post('/promotions')
  @UseBefore(upload.single('promotions'))
  public async uploadPromotions(@Req() request: ApiRequest, @Res() response: Response, @Body() body: RequestUploadPromotionBody) {
    try {
      const { type = 'promotion', date_start, date_end } = body
      const { tenant, file } = request

      if (!file) {
        return response.status(400).json({
          error: 'missing_field_file'
        })
      }

      const filePath = file.path
      const fileName = file.filename

      const importPending = await importHistoryCountService.execute({
        tenant,
        status: 'pending',
        module: 'promotion'
      })

      if (importPending > 0) {

        throw new Error('import_in_progress')
      }

      const { promotions = [], redisKey } = await uploadGetPromotionXlsDataService.getPromotionXlsData({
        type,
        tenant,
        filePath,
        date_start,
        date_end
      })

      const total = promotions.length
      const inserted = await RedisPlugin.set(redisKey, promotions)

      if (inserted.includes('OK')) {
        const importResponse = await importHistoryCreateService.execute({
          total,
          tenant,
          path: filePath,
          title: fileName,
          module: 'promotion',
          createdAt: new Date()
        })

        if (importResponse) {
          const importId = importResponse._id.toString()
          const expiresAt = moment().add('1', 'hour').unix()

          await QueuePlugin.publish('handle-product-promotion', { redisKey, action: 'customer', tenant, importId })

          await RedisPlugin.expireAt(redisKey, expiresAt)
          removeFile(filePath)
        }
      }

      return response.json({
        total,
        redisKey
      })

    } catch (error) {
      console.log(error)
      removeFile(request.file.path)
      return response.status(500).json({
        error: error.message
      })
    }
  }
  @Post('/customer')
  @UseBefore(upload.single('file'))
  public async uploadCustomer(@Req() request: ApiRequest, @Res() response: Response) {
    try {
      const { tenant } = request

      if (!request.file) {

        return response.status(400).json({
          error: 'missing_field_file'
        })
      }
      const filePath = request.file.path
      const fileName = request.file.filename

      const importPending = await importHistoryCountService.execute({
        tenant,
        status: 'pending',
        module: 'customer'
      })

      if (importPending > 0) {

        throw new Error('import_in_progess')
      }

      const { redisKey, customers = [] } = await ImportCustomerService.execute({ filePath, tenant })

      const inserted = await RedisPlugin.set(redisKey, customers)
      const total = customers.length

      if (inserted.includes('OK')) {
        const importResponse = await importHistoryCreateService.execute({
          total,
          tenant,
          path: filePath,
          title: fileName,
          module: 'customer',
          createdAt: new Date()
        })

        if (importResponse) {
          const importId = importResponse._id.toString()
          const expiresAt = moment().add('1', 'hour').unix()

          await QueuePlugin.publish('handle-import-customer', { redisKey, action: 'customer', tenant, importId })
          await RedisPlugin.expireAt(redisKey, expiresAt)

          removeFile(filePath)
        }
      }

      return response.json({
        total,
        redisKey
      })

    } catch (error) {
      console.log(error)
      removeFile(request.file.path)

      return response.status(500).json({
        error: error.message
      })
    }
  }

  @Put('/pmc')
  @UseBefore(upload.single('file'))
  public async uploadPmc(@Req() request: ApiRequest, @Body() body: RequestImportPMCBody, @Res() response: Response) {
    try {
      const { store = '' } = body

      if (!request.file) {

        return response.status(400).json({
          error: 'missing_field_file'
        })
      }

      const filePath = request.file.path

      const storeUrls = store.replace(/\s/g, '').length > 0 ? store.replace(/\s/g, '').split(',') : []

      const urls = filterValidUrls(storeUrls)

      const stores = await storeGetStoreByUrlService.getStoresByUrl({ urls })

      const { redisKey, pmcValues } = await uploadGetPMCSevice.getPMCImportData({ filePath })

      const tenants = stores.map(_store => _store.tenant)

      const expiresAt = moment().add('15', 'minutes').unix()

      await RedisPlugin.set<RequestUpdatePMCValues>(redisKey, { tenants, pmcValues })

      await RedisPlugin.expireAt(redisKey, expiresAt)

      await QueuePlugin.publish('handle-import-pmc', { redisKey })

      removeFile(filePath)

      return response.json({
        redisKey
      })

    } catch (error) {
      console.log(error)
      removeFile(request.file.path)

      return response.status(500).json({
        error: error.message
      })
    }
  }
}