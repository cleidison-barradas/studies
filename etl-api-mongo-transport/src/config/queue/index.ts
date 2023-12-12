const {
  AMQP_MAIN_HOST,
  AMQP_CACHE_HOST
} = process.env

export default {
  main: `${AMQP_MAIN_HOST}?heartbeat=300`,
  cacheEngine: `${AMQP_CACHE_HOST}?heartbeat=300`
}
