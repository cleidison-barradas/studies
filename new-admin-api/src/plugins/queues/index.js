const { AMQP } = require('@mypharma/etl-engine')

const main_queue = new AMQP()
const dead_queue = new AMQP()
const QueuePluginHandler = new AMQP()

module.exports = {
  main_queue,
  dead_queue,
  QueuePluginHandler
}
