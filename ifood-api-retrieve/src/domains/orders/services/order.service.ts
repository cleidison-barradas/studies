import { colors, logger } from "@mypharma/api-core"
import { RedisPlugin } from "@mypharma/etl-engine"

import { QueueMainPlugin } from "../../../support/plugins/queue"
import IfoodPlugin from '../../../support/plugins/ifood'

import { IfoodConnection } from "../../../interfaces/ifood.service.interface"
import { getRegistredStore } from "../../store/services/store.service"

export const orderService = async () => {
  const stores = await getRegistredStore()

  if (stores.length > 0) {

    for await (const store of stores) {
      const tenant = store.tenant
      const settings = store.settings

      const redisKey = `ifood_connection_${store._id.toString()}`

      try {

        let connection: IfoodConnection | null = await RedisPlugin.hget(redisKey)
        const ifoodPlugin = new IfoodPlugin({ settings })

        const accessToken = await ifoodPlugin.auth()

        if (!connection) {
          const { client_id, client_secret, client_store_id } = ifoodPlugin.getCredentials()

          connection = {
            ...connection,
            tenant,
            accessToken,
            clientId: client_id,
            clientSecret: client_secret,
            clientStoreId: client_store_id,
          }
        }

        connection = {
          ...connection,
          accessToken
        }

        // Remove old connection if exists
        await RedisPlugin.remove(redisKey)
        // Set new connection
        await RedisPlugin.hset(redisKey, connection as any)

        await QueueMainPlugin.publish('ifood_sync_order', connection)

        logger(`send request to sync orders ifood on ${tenant}`, colors.FgGreen)

      } catch (error) {
        console.log(error)
        logger(`failed process credentails on ${tenant}`, colors.FgRed)
      }
    }
  }
}