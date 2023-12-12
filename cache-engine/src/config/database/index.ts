import { IConnectionConfig, ConnectionType } from '@mypharma/api-core'

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASS,
  DATABASE_ENV
} = process.env


export const dbLocalConfig: IConnectionConfig = {
  type: 'mongodb',
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  database: DATABASE_NAME,
  name: DATABASE_NAME,
  username: DATABASE_USER,
  password: DATABASE_PASS,
  authSource: 'admin',
  connectionType: ConnectionType.Master,
  useNewUrlParser: true,
  useUnifiedTopology: true
}

const atlasConfig: IConnectionConfig = {
  type: 'mongodb',
  url: `mongodb+srv://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}/?retryWrites=true&w=majority`,
  useNewUrlParser: true,
  logging: true,
  database: DATABASE_NAME,
  name: DATABASE_NAME,
  connectionType: ConnectionType.Master,
}

export const mongoConnection = DATABASE_ENV ? atlasConfig : dbLocalConfig

export default { mongoConnection }