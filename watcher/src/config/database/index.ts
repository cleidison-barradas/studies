import { ConnectionOptions } from 'typeorm'

// Models
import { Search } from '../../domains/search/models/base/Search'
import { Store } from '../../domains/search/models/base/Store'
import { User } from '../../domains/search/models/base/User'

const {
  MONGO_HOST,
  MONGO_PORT = 27017,
  MONGO_DATABASE,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_AUTH_SOURCE,
  DATABASE_ENV
} = process.env

let connection: ConnectionOptions = {
  type: 'mongodb',
  host: MONGO_HOST,
  port: Number(MONGO_PORT),
  username: MONGO_USERNAME,
  password: MONGO_PASSWORD,
  database: MONGO_DATABASE,
  authSource: MONGO_AUTH_SOURCE,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  entities: [
    Search,
    Store,
    User
  ]
}

if (DATABASE_ENV) {
  connection = {
    type: 'mongodb',
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/?retryWrites=true&w=majority`,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    database: MONGO_DATABASE,
    name: MONGO_DATABASE,
    entities: [
      Search,
      Store,
      User
    ]
  }
}

export default {
  connections: [connection]
}
