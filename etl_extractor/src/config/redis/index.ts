import { RedisOptions } from "ioredis"

export default {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  family: 4
} as RedisOptions