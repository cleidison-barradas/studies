// Api Core
const { ConnectionType } = require('@mypharma/api-core')
const {
  DATABASE_ENV,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_AUTH_SOURCE
} = process.env

let dbConfig = {
  type: 'mongodb',
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  database: DATABASE_NAME,
  name: DATABASE_NAME,
  username: DATABASE_USER,
  password: DATABASE_PASSWORD,
  authSource: DATABASE_AUTH_SOURCE,
  connectionType: ConnectionType.Master,
  useNewUrlParser: true,
  useUnifiedTopology: true
}

if (DATABASE_ENV) {
  dbConfig = {
    type: 'mongodb',
    url: `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}/?retryWrites=true&w=majority`,
    useNewUrlParser: true,
    logging: true,
    name: DATABASE_NAME,
    database: DATABASE_NAME,
    connectionType: ConnectionType.Master,
  }
}

const mongoConfig = dbConfig


module.exports = { mongoConfig }
