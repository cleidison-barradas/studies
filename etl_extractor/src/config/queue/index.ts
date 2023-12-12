export default {
  main: `${process.env.AMQP_HOST}?heartbeat=300`,
  cacheEngine: `${process.env.AMQP_CACHE_HOST}?heartbeat=300`
}