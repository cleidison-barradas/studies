import * as Server from 'socket.io'
import * as moment from 'moment'
import { EventEmitter } from 'events'
import {
  RedisPlugin,

  // Interfaces
  ISocketConnection,
  ISocketRedisData,
  ISocketDataStruct,

  // Helpers
  socketDataParser,
  socketDataMountHandler
} from '@mypharma/etl-engine'
import config from '../../../config/socket'

type FindConnection = {
  userId?: number,
  sessionId?: string
}

export interface ReceivedConnection {
  userId: number,
  token: string,
  version: string,
  encrypted: boolean,
  socket: Server.Socket,
  redisKey: string,
  cache: ISocketRedisData | null
}

export interface Disconnected {
  connection: ISocketConnection | null,
  reason: string
}

export interface ReceivedData {
  data: any,
  connection: ISocketConnection,
  redisKey: string
}

// Core events
declare interface Socket {
  on(event: 'connect', listener: (args: ReceivedConnection) => void),
  on(event: 'disconnect', listener: (args: Disconnected) => void),
  on(event: 'sync-products', listener: (args: ReceivedData) => void),
  on(event: 'send-products', listener: (args: ReceivedData) => void),
}

class Socket extends EventEmitter {
  private server: Server.Server

  private connections: ISocketConnection[] = []

  constructor() {
    super()

    this.server = new Server(config.port, {
      transports: ['websocket', 'polling'],
      allowUpgrades: false,
      pingInterval: 25000,
      pingTimeout: 60000
    })

    // Connect event
    this.server.on('connect', (socket) => this.onConnect(socket))

    // Debbugging
    console.log(`Socket started! Listening on ${config.port}`)
  }

  /**
   * Starting socket connection
   * 
   * @param socket 
   */
  private async onConnect(socket: Server.Socket) {
    const { user_id, token, version, encrypted = 'true' } = socket.handshake.query

    // Invalid opts
    if (!user_id || !token) {
      socket.disconnect(true)
    }

    // Store cache
    const redisKey = await this.storeCache(Number(user_id), socket)

    // Persist cache connection
    await RedisPlugin.persist(redisKey)

    // Grab cache
    const cache = await RedisPlugin.hget(redisKey)

    // Core events
    socket.on('disconnect', (reason: string) => this.onDisconnect(socket, reason))
    socket.on('data_plain', (data: ISocketDataStruct) => this.onData(socket, data))

    // Emit event
    this.emit('connect', {
      userId: Number(user_id),
      token: token,
      version: version,
      encrypted: encrypted === 'true',
      cache: cache,
      socket,
      redisKey
    } as ReceivedConnection)
  }

  /**
   * Disconnected connection event
   * 
   * @param socket 
   * @param reason 
   */
  private async onDisconnect(socket: Server.Socket, reason: string) {
    const conn = this.get({
      sessionId: socket.id
    })

    this.emit('disconnect', {
      connection: conn ? Object.assign({}, conn, { socket: null }) : null,
      reason
    } as Disconnected)

    if (conn) {
      // Redis key
      const redisKey = `etl_connection:${conn.user.userId}`

      // Save current connection state
      let cache: ISocketRedisData = await RedisPlugin.hget(redisKey)
      if (cache) {
        cache.data = {
          invalidUids: conn.data.invalidUids,
          mountData: conn.data.mountData
        }

        await RedisPlugin.hset(redisKey, cache as any) // Save redis cache

        // Set expire for cache
        await RedisPlugin.expireAt(redisKey, moment().add(10, 'minutes').unix())
      }

      // Free memory
      cache = null
    }

    // Remove connection
    this.remove({
      sessionId: socket.id
    })
  }

  /**
   * Receiving plain-text data event
   * 
   * @param socket 
   * @param socketData 
   */
  private async onData(socket: Server.Socket, socketData: ISocketDataStruct) {
    let conn = this.get({
      sessionId: socket.id
    })

    if (!conn) {
      console.log('Connection not found! Disconnecting...')
      socket.disconnect(true)
      return
    }

    conn = socketDataParser(conn, socketData)
    this.update(conn)

    // signal to client that we have received the chunk
    socket.emit('data_received', socketData.uid)

    if (conn.data.mountData.length === socketData.length) {
      const mountedData = socketDataMountHandler(conn.data)

      // Reset in-memory cache
      conn.data = {
        invalidUids: [],
        mountData: []
      }
      this.update(conn)

      if (mountedData) {
        const { event, data } = mountedData

        // Save the mounted data into redis cache
        const redisKey = `etl_connection:${conn.user.userId}`
        let cache: ISocketRedisData = await RedisPlugin.hget(redisKey)

        const store = conn.user.store as any

        // If we have lost the connection, we should recreate it
        if (!cache) {
          cache = {
            userId: conn.user.userId,
            storeId: store.original_id,
            sessionId: socket.id,
            currentEvent: null,
            data: {
              invalidUids: [],
              mountData: []
            },
            response: null
          }
        }

        // Update cache connection state
        cache.data = {
          invalidUids: [],
          mountData: []
        }
        cache.currentEvent = {
          name: event,
          data: data
        }

        await RedisPlugin.hset(redisKey, cache as any) // Save redis cache

        // Free mmeory
        cache = null

        // Emitter event
        this.emit(event, {
          data: data,
          connection: conn,
          redisKey
        } as ReceivedData)
      } else {
        console.log(`Could not mount data from ${conn.user.store.name}`)
        socket.emit('data_integrity_failed', socketData.uid)
      }
    }
  }

  /**
   * Add new socket connection
   * 
   * @param connection 
   */
  public add = async (connection: ISocketConnection) => {
    // Redis key
    const redisKey = `etl_connection:${connection.user.userId}`

    try {

      // Remove existing connection
      this.remove({
        userId: connection.user.userId
      })

      // Push new connection
      this.connections.push(connection)

      // Get cache
      let cache: ISocketRedisData = await RedisPlugin.hget(redisKey)
      const store = connection.user.store as any

      // Setup store id
      cache.storeId = store.original_id

      // Save cache
      await RedisPlugin.hset(redisKey, cache as any)

      // Free memory
      cache = null
    } catch (error) {
      console.log(redisKey)
      throw error
    }
  }

  /**
   * Update existing socket connection
   * 
   * @param conn 
   */
  public update = (conn: ISocketConnection) => {
    if (!conn) return null

    const index = this.connections.filter(conn => conn).findIndex(conn => conn.user.userId === conn.user.userId)

    if (this.connections[index]) {
      this.connections[index] = conn
    }
  }

  /**
   * Get existing socket connection
   * 
   * @param opts 
   */
  public get = (opts: FindConnection) => {
    const { userId, sessionId } = opts

    if (userId) {
      return this.connections.filter(conn => conn).find(conn => conn.user.userId === userId)
    }
    if (sessionId) {
      return this.connections.filter(conn => conn).find(conn => conn.socket.id === sessionId)
    }

    return null
  }

  /**
   * Remove existing socket connection
   * 
   * @param opts 
   */
  public remove = (opts: FindConnection) => {
    const { userId, sessionId } = opts
    let index = -1

    if (userId) {
      index = this.connections.filter(conn => conn).findIndex(conn => conn.user.userId === userId)
    }
    if (sessionId) {
      index = this.connections.filter(conn => conn).findIndex(conn => conn.socket.id === sessionId)
    }

    if (this.connections[index]) {
      this.connections[index].socket.removeAllListeners()
      this.connections[index].socket.disconnect(true)

      this.connections[index] = null
      delete this.connections[index]
    }
  }

  public send(sessionId: string, data: any, encrypted: boolean = false) {
    if (!this.server.sockets.adapter.rooms[sessionId]) throw new Error('Socket session not found!')

    this.server.to(sessionId).emit(encrypted ? 'data' : 'data_plain', data)
  }

  public isConnected(opts: FindConnection) {
    const { sessionId, userId } = opts

    if (sessionId) {
      return this.server.sockets.adapter.rooms[sessionId] !== undefined
    }
    if (userId) {
      const conn = this.get({ userId })
      if (!conn) return false

      return this.server.sockets.adapter.rooms[conn.socket.sessionId] !== undefined
    }

    return false
  }

  private async storeCache(userId: number, socket: Server.Socket) {
    // Redis key
    const redisKey = `etl_connection:${userId}`

    // Check if redis connection cache already exists
    const existsCache = await RedisPlugin.hexists(redisKey, 'sessionId')

    // If exists, we should only update the session id
    if (existsCache) {
      // Get cache
      const conn: ISocketRedisData = await RedisPlugin.hget(redisKey)

      // Update session id
      conn.sessionId = socket.id

      // Save to redis
      await RedisPlugin.hset(redisKey, conn as any)
    } else {
      // Seems we are newbie here, so let's create a brand new connection cache
      const conn: ISocketRedisData = {
        userId: userId,
        storeId: null,
        sessionId: socket.id,
        currentEvent: null,
        data: {
          invalidUids: [],
          mountData: []
        },
        response: null
      }

      await RedisPlugin.hset(redisKey, conn as any)
    }

    return redisKey
  }
}

export default new Socket()
