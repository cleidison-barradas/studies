import { ISocketRedisData, RedisPlugin } from '@mypharma/etl-engine'
import Socket from '../../../../support/plugins/socket'

export const resumeTask = async (redisKey: string, connection: ISocketRedisData) => {
  if (connection.currentEvent.name === 'sync-products') {
    // We got the connection and the response, so we should send to the client :D
    Socket.send(connection.sessionId, connection.response, false)

    // Remove redis current event
    connection.currentEvent = null
    connection.response = null

    // Save redis cache
    await RedisPlugin.hset(redisKey, connection as any)
  }
}

