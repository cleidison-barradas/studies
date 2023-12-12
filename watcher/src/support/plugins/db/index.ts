import { createConnection, Connection } from 'typeorm'
import config from '../../../config/database'

export enum ConnectionType {
  WATCHER = 0
}

export let DBConnection: Connection

export const initDb = async (connectionType: ConnectionType): Promise<Connection> => {
  try {
    if (!config.connections[connectionType]) throw new Error('Invalid connection type')

    DBConnection = await createConnection(config.connections[connectionType])
    return DBConnection
  } catch (error) {
    throw error
  }
}
