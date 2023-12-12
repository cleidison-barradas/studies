const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
} = process.env

module.exports = {
  databaseConfig: {
    host: DATABASE_HOST || 'localhost',
    port: DATABASE_PORT || 3306,
    database: DATABASE_NAME,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    dialect: 'mysql',
    dialectOptions: {
      multipleStatements: true
    },
    pool: {
      max: 100,
      min: 0,
      acquire: 1000000
    },
    retry: {
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ],
      name: 'query',
      backoffBase: 100,
      backoffExponent: 1.1,
      timeout: 60000,
      max: Infinity
    },
    logging: false
  },
  connection: {
    host: DATABASE_HOST || 'localhost',
    port: DATABASE_PORT || 3306,
    database: DATABASE_NAME,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
}
