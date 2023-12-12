const path = require("path");
const fs = require("fs");
const { ConnectionType } = require("@mypharma/api-core");
const {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_ENV,

  PORT,
  HTTP_SERVER_PORT,
  HTTP_ERROR_LOG_FILE,
  HTTP_ACCESS_LOG_FILE,

  JWT_ISSUER,
  JWT_SUBJECT,
  JWT_AUDIENCE,
  JWT_EXPIRES,
  JWT_ALGORITHM,

  AWS_S3_BUCKET,
  AWS_S3_API_VERSION,
  AWS_S3_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_REGION,

  AMQP_HOST,
  AMQP_ETL,
  AMQP_ERP_MAIN,
  AMQP_ERP_DEAD,
  AMQP_HOST_HANDLER,

  SENDGRID_KEY,
  SENDGRID_USER,
  REDIS_PORT,
  REDIS_HOST,
  REDIS_PASSWORD,

  EPHARMA_BASE_URL,
} = process.env;

console.log(process.env)

const ACCESS_LOG = path.join(__dirname, "../../", "storage/log", "access.log");
const ERROR_LOG = path.join(__dirname, "../../", "storage/log", "error.log");

let mongoConfig = {
  type: "mongodb",
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  database: DATABASE_NAME,
  name: DATABASE_NAME,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  authSource: "admin",
  connectionType: ConnectionType.Master,
  useNewUrlParser: true,
  useUnifiedTopology: true
}

if (DATABASE_ENV) {
  mongoConfig = {
    type: 'mongodb',
    url: `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}/?retryWrites=true&w=majority`,
    useNewUrlParser: true,
    logging: true,
    database: DATABASE_NAME,
    name: DATABASE_NAME,
    connectionType: ConnectionType.Master,
  }
}

module.exports = {
  databases: {
    mongoConfig,
    mongoDB: {
      connectionString: DATABASE_ENV
        ? `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}?retryWrites=true&w=majority`
        : `mongodb://${DATABASE_HOST || "0.0.0.0"}:${DATABASE_PORT || 27017}/${DATABASE_NAME || "db"
        }?authSource=admin&retryWrites=false`,
      options: {
        useUnifiedTopology: true,
        user: DATABASE_USERNAME,
        pass: DATABASE_PASSWORD,
        useNewUrlParser: true,
        useCreateIndex: true,
        poolSize: 10,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 30000,
      },
    },
    redis: {
      port: REDIS_PORT,
      host: REDIS_HOST,
      password: REDIS_PASSWORD,
      family: 4,
    },
  },
  http: {
    port: PORT || HTTP_SERVER_PORT,
    logging: {
      access:
        HTTP_ACCESS_LOG_FILE && HTTP_ACCESS_LOG_FILE.length > 0
          ? HTTP_ACCESS_LOG_FILE
          : ACCESS_LOG,
      error:
        HTTP_ERROR_LOG_FILE && HTTP_ERROR_LOG_FILE.length > 0
          ? HTTP_ERROR_LOG_FILE
          : ERROR_LOG,
    },
  },
  jwt: {
    issuer: JWT_ISSUER,
    subject: JWT_SUBJECT,
    audience: JWT_AUDIENCE,
    expiresIn: JWT_EXPIRES,
    algorithm: JWT_ALGORITHM,
  },
  s3: {
    _bucket: AWS_S3_BUCKET,
    apiVersion: AWS_S3_API_VERSION,
    accessKeyId: AWS_S3_KEY_ID,
    secretAccessKey: AWS_S3_ACCESS_KEY,
    region: AWS_S3_REGION,
    signatureVersion: "v4",
  },
  amqpHost: `${AMQP_HOST}?heartbeat=90`,
  amqpHostHandlerApi: `${AMQP_HOST_HANDLER}?heartbeat=90`,
  etlHost: `${AMQP_ETL}?heartbeat=300`,
  erpMain: `${AMQP_ERP_MAIN}?heartbeat=300`,
  erpDead: `${AMQP_ERP_DEAD}?heartbeat=300`,

  sendgrid: {
    user: SENDGRID_USER,
    key: SENDGRID_KEY,
    templates: {
      cupom: "d-94d2fabddf7d4adcb22240b7c8eb8af3",
    },
  },
  epharma: {
    baseURL: EPHARMA_BASE_URL,
  },
};
