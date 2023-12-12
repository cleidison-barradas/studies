const { AMQP } = require('@mypharma/etl-engine')

const QueuePlugin = new AMQP()
const CacheQueuePlugin = new AMQP()

module.exports = { CacheQueuePlugin, QueuePlugin } 