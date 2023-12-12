import { ORM, logger, colors } from "@mypharma/api-core"
import { IIimportData } from "../../../interfaces/import"

import RedisPlugin from "../../../support/plugins/redis"
import {
  QueuePlugin,
  QueuePluginCacheEngine
} from "../../../support/plugins/queue"

import ImportUpdateService from "../../import/services/ImportUpdateService"
import { productService } from "../../product/service/ProductService"
import StoreGetByTenantService from '../../store/services/StoreGetByTenantService'
import { IProduct } from "../../../interfaces/product"

const importUpdateService = new ImportUpdateService()
const storeGetByTenantService = new StoreGetByTenantService()

const LIMIT_SERVICE_PROCESS: number = 1000

export const productServices = async ({ data, msg }: any) => {
  const { tenant, redisKey, importId } = data.content as IIimportData
  let processed: number = 0
  let totalReceived: number = 0

  try {

    if (!tenant || !redisKey) {

      throw new Error('missing_tenant_or_redisKey')
    }

    const store = await storeGetByTenantService.getStoreByTenant({ tenant })

    await ORM.setup(null, tenant)

    const products = await RedisPlugin.get<Array<IProduct>>(redisKey)

    if (!products || products.length <= 0) {

      throw new Error('product_data_not_provided')
    }

    logger(`processing ${products.length} products on ${tenant}`, colors.FgYellow)

    do {
      const process = products.slice(0, LIMIT_SERVICE_PROCESS)

      const { invalidateCache, modifiedCount } = await productService(process, store)
      processed += modifiedCount
      totalReceived += process.length

      if (invalidateCache.length > 0) {

        await QueuePluginCacheEngine.publish('mongo-invalidate-product', invalidateCache)
      }

      products.splice(0, LIMIT_SERVICE_PROCESS)

    } while (products.length > 0)

    if (importId) {

      await importUpdateService.execute({
        tenant,
        importId,
        processed,
        failures: totalReceived - processed,
        status: 'finished',
      })
    }

    logger(`processed ${processed} products on ${tenant}`, colors.FgYellow)

    processed = 0
    totalReceived = 0
    if (redisKey) await RedisPlugin.delete(redisKey)
    await QueuePlugin.ack('handle-import-product', msg)

  } catch (error) {
    processed = 0
    totalReceived = 0

    console.log(error.message)
    await QueuePlugin.ack('handle-import-product', msg)

    if (redisKey) await RedisPlugin.delete(redisKey)

    if (importId) {
      await importUpdateService.execute({
        tenant,
        importId,
        status: 'failure'
      })
    }
  }

}