import { QueuePlugin } from '@mypharma/etl-engine'
import { ReceivedData } from '../../../../support/plugins/socket'
import socketConfig from '../../../../config/socket'

export const syncProductEvent = async (data: ReceivedData) => {
  const { redisKey } = data
  const identifier = data.data?.identifier

  await QueuePlugin.publish('retrieve-products', { redisKey, identifier }, socketConfig.port.toString())
}
