import { ConnectionType, IConnectionConfig } from '@mypharma/api-core'

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

const mongoConfig = process.env.DATABASE_ENV ? atlasConfig : dbLocalConfig

export default mongoConfig