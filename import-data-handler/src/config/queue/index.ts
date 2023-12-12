export default {
  amqpHost: `${process.env.AMQP_HOST}?heartbeat=90`,
  amqpHostCacheEngine: `${process.env.AMQP_HOST_CACHE_ENGINE}?heartbeat=90`,
}