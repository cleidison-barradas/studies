import { ORM, colors, logger } from '@mypharma/api-core'
import { RedisPlugin } from '@mypharma/etl-engine'
import * as moment from 'moment'

import { QueueMainPlugin } from '../../../support/plugins/queue'
import IfoodPlugin from '../../../support/plugins/ifood'

import { IfoodConnection } from '../../../interfaces/ifood.service.interface'
import { countProducts } from '../../products/services/product.service'
import { getRegistredStore } from '../../store/services/store.service'

import queueConfig from '../../../config/queue'

export const ifoodService = async () => {
  const stores = await getRegistredStore()

  if (stores.length > 0) {

    for await (const store of stores) {
      let canSentProduct = false
      const tenant = store.tenant
      const currentTime = moment()
      const settings = store.settings

      try {

        const redisKey = `ifood_connection_${store._id.toString()}`

        let connection: IfoodConnection | null = await RedisPlugin.hget(redisKey)

        const ifoodPlugin = new IfoodPlugin({ settings })

        const accessToken = await ifoodPlugin.auth()

        await ORM.setup(null, tenant)

        const limitSentProducts = await countProducts(tenant)

        if (!connection) {

          const {
            client_id: clientId,
            client_secret: clientSecret,
            client_store_id: clientStoreId
          } = ifoodPlugin.getCredentials()

          connection = {
            ...connection,
            tenant,
            clientId,
            clientSecret,
            clientStoreId
          }
        }

        connection = {
          ...connection,
          accessToken,
          limitSentProducts
        }

        if (!connection.event || (connection.event === 'finalized' && currentTime.isSameOrAfter(connection.lastUpdated))) {
          canSentProduct = true

          connection = {
            ...connection,
            event: 'send_products'
          }
        }

        // Remove old connection if exists
        await RedisPlugin.remove(redisKey)
        // Set new connection
        await RedisPlugin.hset(redisKey, connection as any)

        const expiresAt = Math.floor(Date.now() / 1000) + 7200
        await RedisPlugin.expireAt(redisKey, expiresAt)

        if (canSentProduct) {
          await QueueMainPlugin.publish('ifood-retrieve-products', { redisKey }, queueConfig.nodes[0])

          logger(`send request to sync products ifood on ${tenant}`, colors.FgGreen)
        }

      } catch (error) {
        canSentProduct = false

        logger(`failed process credentails on ${tenant}`, colors.FgRed)

        if (error.response) {
          console.log(error.response.data)

        } else {
          console.log(error)
        }
      }
      canSentProduct = false
    }
  }
}