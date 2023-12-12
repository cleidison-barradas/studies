import { RedisOptions } from '@mypharma/etl-engine'

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD
} = process.env

export default {
  host: REDIS_HOST,
  port: REDIS_PORT || 6379,
  password: REDIS_PASSWORD,
  family: 4
} as RedisOptions
