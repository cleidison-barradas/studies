import { Disconnected } from '../../../../support/plugins/socket'

export const disconnectEvent = (data: Disconnected) => {
  const { connection, reason } = data

  if (connection) {
    console.log(`Disconnecting ${connection.user.store.name} - Reason: ${reason}`)
  }
}