import Socket from '../../../support/plugins/socket'
import { connectEvent } from '../helpers/events/ConnectEvent'
import { disconnectEvent } from '../helpers/events/DisconnectEvent'
import { syncProductEvent } from '../helpers/events/SyncProductEvent'
import { receiveProductEvent } from '../helpers/events/ReceiveProductEvent'

export const socketService = async () => {
  Socket.on('connect', connectEvent)
  Socket.on('disconnect', disconnectEvent)
  Socket.on('sync-products', syncProductEvent)
  Socket.on('send-products', receiveProductEvent)
}
