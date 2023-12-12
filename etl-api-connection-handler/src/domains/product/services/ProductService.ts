import * as moment from 'moment'
import { ISocketRedisData, QueuePlugin, RedisPlugin } from '@mypharma/etl-engine'
import Socket from '../../../support/plugins/socket'

export const productService = async () => {
  // Consume send/received products queue
  await QueuePlugin.consume('send-products')
  await QueuePlugin.consume('persisted-products')

  QueuePlugin.on('send-products', async ({ data, msg }) => {
    try {
      const { content } = data

      if (content.redisKey) {
        // Grab socket connection
        let connection: ISocketRedisData = await RedisPlugin.hget(content.redisKey)

        // If we did not find the connection and/or response on redis, we should already ack this item
        if (!connection?.response) {
          await QueuePlugin.ack('send-products', msg)
          return
        }

        // If client is not connected
        // We will send at connection event and also we will set a expire for the connection cache
        if (!Socket.isConnected({ sessionId: connection.sessionId })) {
          await RedisPlugin.expireAt(content.redisKey, moment().add(2, 'hours').unix())

          // Ack queue msg
          await QueuePlugin.ack('send-products', msg)
          return
        }

        // We got the connection and the response, so we should send to the client :D
        Socket.send(connection.sessionId, connection.response, false)

        // Ack queue msg
        await QueuePlugin.ack('send-products', msg)

        // Remove redis current event
        connection.currentEvent = null
        connection.response = null

        // Save redis cache
        await RedisPlugin.hset(content.redisKey, connection as any)
      }
    } catch (err) {
      console.log(err)
    }
  })

  QueuePlugin.on('persisted-products', async ({ data, msg }) => {
    try {
      const { content } = data

      if (content.redisKey) {
        // Grab socket connection
        let connection: ISocketRedisData = await RedisPlugin.hget(content.redisKey)

        // If we did not find the connection and/or response on redis, we should already ack this item
        if (!connection?.response) {
          await QueuePlugin.ack('persisted-products', msg)
          return
        }

        // If client is not connected
        // We will send at connection event and also we will set a expire for the connection cache
        if (!Socket.isConnected({ sessionId: connection.sessionId })) {
          await RedisPlugin.expireAt(content.redisKey, moment().add(2, 'hours').unix())

          // Ack queue msg
          await QueuePlugin.ack('persisted-products', msg)
          return
        }

        // We got the connection and the response, so we should send to the client :D
        Socket.send(connection.sessionId, connection.response, false)

        // Ack queue msg
        await QueuePlugin.ack('persisted-products', msg)

        // Remove redis current event
        connection.currentEvent = null
        connection.response = null

        // Save redis cache
        await RedisPlugin.hset(content.redisKey, connection as any)
      }
    } catch (err) {
      console.log(err)
    }
  })
}
