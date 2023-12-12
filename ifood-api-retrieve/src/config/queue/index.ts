const {
  AMQP_MAIN_IFOOD_HOST,
  AMQP_NODES = '7180'
} = process.env

export default {
  main: `${AMQP_MAIN_IFOOD_HOST}?heartbeat=90`,
  nodes: AMQP_NODES.toString()?.split(',') || []
}
