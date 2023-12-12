const path = require("path");

const {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_ENV,

  HTTP_SERVER_PORT,
  HTTP_ACCESS_LOG_FILE,
  HTTP_ERROR_LOG_FILE,

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
  GOOGLE_SECRET,
  GOOGLE_CLIENT_ID,
  FACEBOOK_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_BASE_URL,
  FACEBOOK_LOGIN_URL,

  GOOGLE_LOGIN_URL,
  SHIPPING_API,
} = process.env;

/**
 * Default logs files
 */
const ACCESS_LOG = path.join(__dirname, "../../", "storage/log", "access.log");
const ERROR_LOG = path.join(__dirname, "../../", "storage/log", "error.log");

module.exports = {
  /**
   * Databases connections config
   */
  databases: {
    /**
     * MongoDB connection config
     */
    mongoDB: {
      connectionString: DATABASE_ENV
        ? `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}?retryWrites=true&w=majority`
        : `mongodb://${DATABASE_HOST || "0.0.0.0"}:${DATABASE_PORT || 27017}/${
            DATABASE_NAME || "db"
          }?authSource=admin&retryWrites=false`,
      maxReconnectAttempts: 10,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        user: DATABASE_USERNAME,
        pass: DATABASE_PASSWORD,
        // ssl: true,
        // sslValidate: false
      },
    },
  },
  /**
   * HTTP Server config
   */
  http: {
    port: process.env.PORT || HTTP_SERVER_PORT,
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
  /**
   * JWT Config
   */
  jwt: {
    issuer: JWT_ISSUER,
    subject: JWT_SUBJECT,
    audience: JWT_AUDIENCE,
    expiresIn: JWT_EXPIRES,
    algorithm: JWT_ALGORITHM,
  },
  /**
   * S3 AWS
   */
  s3: {
    _bucket: AWS_S3_BUCKET,
    apiVersion: AWS_S3_API_VERSION,
    accessKeyId: AWS_S3_KEY_ID,
    secretAccessKey: AWS_S3_ACCESS_KEY,
    region: AWS_S3_REGION,
  },
  /**
   * Facebook secrets
   */
  facebook: {
    client_id: FACEBOOK_CLIENT_ID,
    secret: FACEBOOK_SECRET,
    baseUrl: FACEBOOK_BASE_URL,
    loginUlr: FACEBOOK_LOGIN_URL,
  },
  /**
   * Google secrets
   */
  google: {
    client_id: GOOGLE_CLIENT_ID,
    secret: GOOGLE_SECRET,
    loginUlr: GOOGLE_LOGIN_URL,
  },
  /**
   * Api shipping
   */
  ApiShipping: {
    baseUrl: SHIPPING_API,
  },
};
