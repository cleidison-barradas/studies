const {
  AMQP_MAIN_IFOOD_HOST,
  AMQP_MAIN_LOG_HOST,
  AMQP_NODE = '7180',
  AMQP_NODES = '7180,71801,7182,7183',
} = process.env

export default {
  main: `${AMQP_MAIN_IFOOD_HOST}?heartbeat=90`,
  log: `${AMQP_MAIN_LOG_HOST}?heartbeat=90`,
  node: AMQP_NODE.toString()?.split(',') || [],
  nodes: AMQP_NODES.toString()?.split(',') || []
}
