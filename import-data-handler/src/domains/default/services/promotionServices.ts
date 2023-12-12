import { colors, logger, ORM } from "@mypharma/api-core"

import RedisPlugin from "../../../support/plugins/redis"

import { ISpecials } from "../../../interfaces/specials"
import { IIimportData } from "../../../interfaces/import"
import { IPromotion } from "../../../interfaces/promotion"

import { QueuePlugin, QueuePluginCacheEngine } from "../../../support/plugins/queue"

import { specialsService } from "../../specials/services/SpecialsService"
import { promotionService } from "../../promotion/services/PromotionService"
import ImportUpdateService from "../../import/services/ImportUpdateService"
import StoreGetByTenantService from '../../store/services/StoreGetByTenantService'
import { productsSpecialsService } from "../../specials/services/productSpecialsService"

const importUpdateService = new ImportUpdateService()
const storeGetByTenantService = new StoreGetByTenantService()
const LIMIT_SERVICE_PROCESS: number = 1000

export const promotionServices = async () => {
  QueuePlugin.on('handle-product-promotion', async ({ data, msg }: any) => {
    const { tenant, redisKey, importId } = data.content as IIimportData

    try {

      if (!tenant || !redisKey) {

        throw new Error('missing_tenant_or_redisKey')
      }

      await ORM.setup(null, tenant)

      const promotions = await RedisPlugin.get<Array<IPromotion>>(redisKey)

      if (!promotions || promotions.length <= 0) {

        throw new Error('promotion_data_not_provided')
      }

      logger(`processing ${promotions.length} promotions on ${tenant}`, colors.FgYellow)

      const { invalidateCache = [], modifiedCount = 0 } = await promotionService(promotions, tenant)

      if (importId) {
        const failures = promotions.length - modifiedCount

        await importUpdateService.execute({
          tenant,
          importId,
          failures,
          status: 'finished',
          processed: modifiedCount,
        })
      }

      if (invalidateCache.length > 0) {
        await QueuePluginCacheEngine.publish('mongo-invalidate-product', invalidateCache)
      }

      if (redisKey) await RedisPlugin.delete(redisKey)
      await QueuePlugin.ack('handle-product-promotion', msg)

    } catch (error) {
      console.log(error.message)

      if (redisKey) await RedisPlugin.delete(redisKey)

      if (importId) {
        await importUpdateService.execute({
          tenant,
          importId,
          status: 'failure',
          failures: 0,
          processed: 0
        })
      }

      await QueuePlugin.ack('handle-product-promotion', msg)
    }
  })

  QueuePlugin.on('handle-process-service-specials', async ({ data, msg }: any) => {
    const { tenant, redisKey } = data.content as IIimportData

    try {

      if (!tenant || !redisKey) {

        throw new Error('missing_tenant_or_redisKey')
      }

      const store = await storeGetByTenantService.getStoreByTenant({ tenant })
      await ORM.setup(null, tenant)

      const specials = await RedisPlugin.get<Array<ISpecials>>(redisKey)

      if (!specials || specials.length <= 0) {

        throw new Error('specials_data_not_provided')
      }

      logger(`processing ${specials.length} specials on ${tenant}`, colors.FgYellow)

      const { productsData, specialsObjPromotion } = await specialsService(specials, store)

      if (!productsData || productsData.length <= 0) {

        throw new Error('products_data_not_provided')

      }

      logger(`processing ${productsData.length} products on ${tenant}`, colors.FgYellow)

      do {

        const process = productsData.slice(0, LIMIT_SERVICE_PROCESS)

        const { invalidateCache, modifiedCount } = await productsSpecialsService(process, specials, specialsObjPromotion, store)

        if (invalidateCache.length > 0) {

          await QueuePluginCacheEngine.publish('mongo-invalidate-product', invalidateCache)
          logger(`sent to cache-engine ${process.length} products specials on ${tenant}`, colors.FgYellow)

        }

        logger(`${modifiedCount} products specials modified in ${tenant}`, colors.FgBlue)
        productsData.splice(0, LIMIT_SERVICE_PROCESS)

      } while (productsData.length > 0)

      if (redisKey) await RedisPlugin.delete(redisKey)

      await QueuePlugin.ack('handle-process-service-specials', msg)

    } catch (error) {
      console.error(error.message)

      if (redisKey) await RedisPlugin.delete(redisKey)
      await QueuePlugin.ack('handle-process-service-specials', msg)
    }
  })

  await QueuePlugin.consume('handle-product-promotion')
  await QueuePlugin.consume('handle-process-service-specials')
}