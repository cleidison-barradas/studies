import { ISocketConfig } from '@mypharma/etl-engine'
import redisConfig from '../redis'

const {
  SOCKET_PORT = 5192
} = process.env

export default {
  port: SOCKET_PORT,
  redis: redisConfig
} as ISocketConfig
