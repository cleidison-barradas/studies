import { ORM, logger, colors } from "@mypharma/api-core"

import RedisPlugin from "../../../support/plugins/redis"
import {
    QueuePlugin,
    QueuePluginCacheEngine
} from "../../../support/plugins/queue"

import { IIimportData } from "../../../interfaces/import"
import { IProductToErp } from "../../../interfaces/productToErp"

import { CreateLog } from "../../../support/helpers/CreateLog"
import StoreGetByTenantService from '../../store/services/StoreGetByTenantService'
import { productToErpService } from "../../productToErp/service/ProductToErpService"

const storeGetByTenantService = new StoreGetByTenantService()

const LIMIT_SERVICE_PROCESS: number = 1000

interface IConnectionData {
    tenant: string
    userId: string
    products: IProductToErp[]
}

export const productsToErpServices = async ({ data, msg }: any) => {
    const { redisKey } = data.content as IIimportData

    try {
        let processed: number = 0

        if (!redisKey) {
            throw new Error('missing_redisKey')
        }

        const redisConnection = await RedisPlugin.get<IConnectionData>(redisKey)

        if (!redisConnection) {

            throw new Error('missing_redis_connection')
        }

        const { products, userId, tenant } = redisConnection

        const store = await storeGetByTenantService.getStoreByTenant({ tenant })

        if (!store) {

            throw new Error('store_not_found')
        }

        await ORM.setup(null, tenant)

        logger(`processing ${products.length} products on ${tenant}`, colors.FgYellow)

        do {
            const process = products.splice(0, LIMIT_SERVICE_PROCESS)

            const { invalidateCache, modifiedCount } = await productToErpService(process, store)
            processed += modifiedCount

            if (invalidateCache.length > 0) {

                await QueuePluginCacheEngine.publish('mongo-invalidate-product', invalidateCache)
            }

        } while (products.length > 0)

        logger(`processed finished ${processed} products on ${tenant}`, colors.FgYellow)
        await CreateLog(tenant, products.length, userId)

        if (redisKey) await RedisPlugin.delete(redisKey)

        await QueuePlugin.ack('erp-update', msg)

        await ORM.closeConnection(tenant)

    } catch (error) {
        console.error(error)

        if (redisKey) await RedisPlugin.delete(redisKey)
        await QueuePlugin.ack('erp-update', msg)
    }
}