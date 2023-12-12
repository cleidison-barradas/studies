import { ORM, StoreRepository, colors, logger } from "@mypharma/api-core"
import Redis from "../../../support/plugins/redis/Redis"

import { ProductParser, productFilter } from "./ProductParser"
import { IInvalidate } from "../../../interfaces/IValidateProduct"
import { IConnectionData } from "../../../interfaces/IConnectionData"
import { CacheEngineQueue, QueuePlugin } from "../../../support/plugins/queue"

interface RedisContent {
  tenant: string
  userId: string
  products: IConnectionData[]
}

export const productService = async () => {
  await QueuePlugin.on('etl-api-extractor-products', async ({ data, msg }: any) => {
    try {
      const redisKey = data.content

      let invalidate: IInvalidate[] = []
      const redisConnection = await Redis.get<RedisContent>(redisKey)

      if (redisConnection) {
        const { tenant, products, userId } = redisConnection

        const store = await StoreRepository.repo().findOne({ tenant })

        if (!store) {

          throw new Error('store_not_found')
        }

        await ORM.setup(null, tenant)

        const totalReceived = products.length

        const eans = products.map(_p => String(_p.EAN))

        let { valids, replicas } = await productFilter(eans, store.tenant)

        logger(`Processing ${totalReceived} on ${tenant}`, colors.FgYellow)

        do {
          const processing = products.splice(0, 1000)

          const processed = await ProductParser(processing, valids, replicas, store, userId)

          invalidate.push(...processed)

        } while (products.length > 0)

        if (invalidate.length > 0) {
          await CacheEngineQueue.publish('mongo-invalidate-product', invalidate)

          console.log(`Processed ${invalidate.length} of ${totalReceived} from ${store.tenant}`)
        }

        valids = []
        replicas = []

        await ORM.closeConnection(store.tenant)
      }

      await Redis.del(redisKey)

      await QueuePlugin.ack('etl-api-extractor-products', msg)

    } catch (error) {
      console.log(error)
      await QueuePlugin.ack('etl-api-extractor-products', msg)
    }
  })
  await QueuePlugin.consume('etl-api-extractor-products')
}