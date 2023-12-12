import RedisPlugin from "../../../support/plugins/redis"
import { QueuePlugin, QueuePluginCacheEngine } from "../../../support/plugins/queue"

import StoreGetByTenantService from '../../store/services/StoreGetByTenantService'

import { RequestUpdatePMCValues } from "../../../interfaces/pmc"
import { ORM } from "@mypharma/api-core"
import { pmcService } from "../../pmc/services/PmcUpdateProduct"

const storeGetByTenantService = new StoreGetByTenantService()

export const pmcServices = async ({ data, msg }: any) => {
  const { redisKey } = data.content
  try {

    if (!redisKey) {

      throw new Error('redis_key_not_provided')
    }

    const redisData = await RedisPlugin.get<RequestUpdatePMCValues>(redisKey)

    if (!redisData) {

      throw new Error('data_not_found')
    }

    const { tenants, pmcValues = [] } = redisData

    if ((tenants && tenants.length > 0) && pmcValues && pmcValues.length > 0) {

      for await (const tenant of tenants) {
        const store = await storeGetByTenantService.getStoreByTenant({ tenant })

        if (!store) {

          throw new Error('store_not_found')
        }

        await ORM.setup(null, tenant)

        console.log(`processing ${pmcValues.length}: pmcs on ${tenant}`)
        const invalidate = await pmcService(tenant, pmcValues)

        if (invalidate.length > 0) {

          await QueuePluginCacheEngine.publish('mongo-invalidate-product', invalidate)
        }
      }

      await QueuePlugin.ack('handle-import-pmc', msg)
      await RedisPlugin.delete(redisKey)
    }

  } catch (error) {
    console.log(error)
    await QueuePlugin.ack('handle-import-pmc', msg)
  }
}