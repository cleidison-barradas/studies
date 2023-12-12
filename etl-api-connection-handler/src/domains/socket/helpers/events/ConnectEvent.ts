import Client, { ReceivedConnection } from '../../../../support/plugins/socket'
import { userRepository } from '../../repositories/UserRepository'
//import { userParser } from '../parsers/UserParser'
import { resumeTask } from '../handlers/ResumeTasks'

export const connectEvent = async (data: ReceivedConnection) => {
  const { userId, token, version, encrypted, socket, cache, redisKey } = data

  let user = await userRepository.getUser(userId, token)
  if (!user) {
    // User or token invalid
    socket.emit('socket_disconnect', {
      message: 'Connection rejected. Invalid session.',
      errorCode: 101
    })

    // Remove connection and disconnect
    Client.remove({
      userId
    })

    return
  }

  // Parser user
  //user = await userParser(user)

  // Handler new connection
  await Client.add({
    createdAt: new Date(),
    data: cache?.data || {
      invalidUids: [],
      mountData: []
    },
    version,
    encrypted,
    user,
    socket 
  })

  // Signal for client know that the connection was made successfully
  socket.emit('connection_complete')

  // Debugging
  console.log(`Establishing connection with store ${user.store.name}. SessionID: ${socket.id}`)

  // If we have a cache for this connection and has pending data to process
  // We will process now :)
  if (cache?.currentEvent) {
    console.log(cache.currentEvent)
    console.log(`-> Resuming process of ${cache.currentEvent.name} for ${user.store.name}`)
    resumeTask(redisKey, cache)
  }
}
