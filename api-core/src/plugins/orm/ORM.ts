/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection, getConnectionManager } from 'typeorm'
import { IConnectionConfig } from '../../interfaces/orm/ConnectionConfig'
import { ConnectionType } from '../../enums/ConnectionType'
import { LoadedEntities } from './Entity'
import { logger } from '../../utils/logger'
import { colors } from '../../utils/colors'

// interface DbConnection {
//   type: ConnectionType,
//   name: string,
//   connection: Connection
// }

class DbORM {
  private defaultConfig: IConnectionConfig | null

  public init(connections: IConnectionConfig[]) {
    return connections.map(config => this.setup(config))
  }

  public async setup(config?: IConnectionConfig, name?: string) {
    if (!config && !this.defaultConfig) {
      throw new Error('ORM: Default config not found!')
    }

    // Default config
    if (!config) {
      config = this.defaultConfig
      config.connectionType = ConnectionType.Store
    }

    // Set connection name
    if (name) {
      config = {
        ...config,
        name: name
      }
    }

    // Set connection type as casting
    config = {
      ...config,
      type: 'mongodb',
    } as IConnectionConfig

    // Initial entities
    config = {
      ...config,
      entities: [`${__dirname.replace('/plugins/orm', '')}/models/**/*.{js,ts}`]
    }

    const connectionManager = getConnectionManager()

    let conn = this.findConnection(config.name)

    if (!conn) {
      (config as any).database = config.name

      conn = connectionManager.create(config)

      await conn.connect()

      logger(`Creating connection with ${config.name}`, colors.FgMagenta)
    } else {
      logger(`Retrieving ${config.name} connection`, colors.FgCyan)
    }

    await this.entitiesConnection(config.connectionType, conn)

    return conn
  }

  private findConnection(name: string): Connection | null {
    const connectionManager = getConnectionManager()

    return connectionManager.connections.find(conn => conn.name === name)
  }

  public connectionExists(name: string): boolean {
    const connectionManager = getConnectionManager()

    return connectionManager.has(name)
  }

  public set config(config: IConnectionConfig) {
    this.defaultConfig = config
  }

  public get config() {
    return this.defaultConfig
  }

  public setupRepository<T = any>(connectionName: string, repository: T) {
    // Setup master connection
    if (!connectionName) {
      connectionName = this.defaultConfig.name
    }

    let conn = this.findConnection(connectionName)

    if (!conn) {

      this.setup(null, connectionName).
        then(connetion => conn = connetion)
    }

    return conn.getCustomRepository<T>(repository as any)
  }

  public async closeConnection(name: string) {
    const connectionManager = getConnectionManager()

    const conn = this.findConnection(name)

    if (conn) {
      const index = connectionManager.connections.findIndex(connection => connection.name === name)

      if (index !== -1) {
        await conn.close()
        connectionManager.connections.splice(index, 1)
        logger(`Removing connection with ${conn.name}`, colors.FgRed)
      }
    }
  }

  public getHasActiveConnection(name: string) {
    const connectionManager = getConnectionManager()

    return connectionManager.has(name)
  }

  private async entitiesConnection(type: ConnectionType, connection: Connection) {
    const entities = LoadedEntities.filter(p => p.type === type).map(p => p.entity)
    for await (const entity of entities) {
      await entity.useConnection(connection)
    }
  }
}

export const ORM = new DbORM()
