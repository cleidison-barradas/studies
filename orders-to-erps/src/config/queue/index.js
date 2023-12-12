const { AMQP_HOST, AMQP_CACHE_HOST } = process.env

module.exports = {
    main: `${AMQP_HOST}?heartbeat=90`,
    cacheEngine: `${AMQP_CACHE_HOST}?heartbeat=90`
}