const {
  AMQP_MAIN_IFOOD_HOST
} = process.env

export default {
  main: `${AMQP_MAIN_IFOOD_HOST}?heartbeat=300`
}
