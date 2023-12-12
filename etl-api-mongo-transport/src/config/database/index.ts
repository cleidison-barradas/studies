import { ConnectionType, IConnectionConfig } from '@mypharma/api-core'

export const database_integration = process.env.DATABASE_INTEGRATION_NAME || 'integration'

let mongoConfig: IConnectionConfig = {
  type: 'mongodb',
  useNewUrlParser: true,
  useUnifiedTopology: true,
  host: process.env.DATABASE_HOST,
  name: process.env.DATABASE_NAME,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  authSource: process.env.DATABASE_AUTH_SOURCE,
  connectionType: ConnectionType.Master
}

if (process.env.DATABASE_ENV) {
  mongoConfig = {
    type: 'mongodb',
    url: `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/?retryWrites=true&w=majority`,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    database: process.env.DATABASE_NAME,
    name: process.env.DATABASE_MASTER_NAME,
    connectionType: ConnectionType.Master,
  }
}

export default mongoConfig

