import { IConnectionConfig, ConnectionType } from '@mypharma/api-core'
import { PoolOptions } from '@mypharma/etl-engine'

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
} = process.env

export const dbLocalConfig: IConnectionConfig = {
  type: 'mongodb',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
  name: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  authSource: process.env.DATABASE_AUTH_SOURCE,
  connectionType: ConnectionType.Master,
  useNewUrlParser: true,
  useUnifiedTopology: true
}

const atlasConfig: IConnectionConfig = {
  type: 'mongodb',
  url: `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/?retryWrites=true&w=majority`,
  useNewUrlParser: true,
  logging: true,
  database: process.env.DATABASE_NAME,
  name: process.env.DATABASE_MASTER_NAME,
  connectionType: ConnectionType.Master,
}

export const mongoConfig = process.env.DATABASE_ENV ? atlasConfig : dbLocalConfig

export default {
  // Master Database
  connections: [
    {
      host: MYSQL_HOST,
      port: MYSQL_PORT || 3306,
      database: MYSQL_DATABASE,
      user: MYSQL_USERNAME,
      password: MYSQL_PASSWORD,

      // Options
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    } as PoolOptions
  ]
}
