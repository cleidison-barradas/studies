import { ORM, StoreRepository } from '@mypharma/api-core'
import { ISocketRedisData, QueuePlugin, RedisPlugin, socketMountPlainTextData } from '@mypharma/etl-engine'

import { InvalidateData, productParser } from '../helpers/parsers/ProductParser'
import { filterUniqueProducts } from '../helpers/filters/filterSocketProduct'

import { CacheQueuePlugin } from '../../../support/plugins/queue'

import { CreateLog } from '../helpers/log/CreateLog'

export const productService = async () => {
  // Consume products retrieve queue
  QueuePlugin.on('mongo-persist-products', async ({ data, msg }) => {
    const { node, content } = data

    try {

      if (!content || !content.redisKey) {

        throw new Error('missing_content_or_redisKey')
      }

      const { redisKey, identifier } = content

      let connection: ISocketRedisData = await RedisPlugin.hget(redisKey)

      if (!connection || !connection.currentEvent) {

        throw new Error('etl_connection_not_found')
      }

      const { name, data } = connection.currentEvent

      const originalId = identifier ? Number(identifier) : Number(connection.storeId)

      if (!originalId) {

        throw new Error('store_id_not_provided')
      }

      const store = await StoreRepository.repo().findOne({
        where: {
          originalId
        }
      })

      if (!store) {

        throw new Error(`store_id_${originalId}_not_found`)
      }

      let invalidate: InvalidateData[] = []

      const hasActiveConnection = ORM.getHasActiveConnection(store.tenant)

      if (hasActiveConnection) {

        throw new Error(`active_connection_exists`)
      }

      if (name === 'send-products' && data?.products && data.products.length > 0) {
        // Setup connection
        await ORM.setup(null, store.tenant)
        const socketProductData = filterUniqueProducts(data.products)

        const totalReceived = socketProductData.length

        console.log(`Processing ${totalReceived} from ${store.tenant}`)

        do {
          const products = socketProductData.splice(0, 1000)

          let processed = await productParser(products, store)

          invalidate.push(...processed)

          processed = null

        } while (socketProductData.length > 0)

        console.log(`Processed ${invalidate.length} of ${totalReceived} from ${store.tenant}`)

        // Parser response
        connection.response = socketMountPlainTextData({
          event: 'received-products',
          data: {
            totalAdded: invalidate.length
          }
        })

        // Save redis socket connection
        await RedisPlugin.hset(redisKey, connection as any)

        if (invalidate.length > 0) {
          await CacheQueuePlugin.publish('mongo-invalidate-product', invalidate)
          await CreateLog(store, connection.userId, invalidate.length)
        }
      }

      invalidate = []
      connection = null
      // Run GC
      if (global.gc) {
        global.gc()
      }

      await QueuePlugin.ack('mongo-persist-products', msg)
      await QueuePlugin.publish('persisted-products', { redisKey }, node)
      await ORM.closeConnection(store.tenant)

    } catch (error) {
      console.log(error)
      await QueuePlugin.ack('mongo-persist-products', msg)
      await QueuePlugin.publish('persisted-products', { redisKey: content.redisKey }, node)
    }
  })

  // Start consuming
  await QueuePlugin.consume('mongo-persist-products')
}