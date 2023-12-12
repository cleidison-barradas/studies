const { AMQP_HOST } = process.env

export default {
  main: `${AMQP_HOST}?heartbeat=300`
}
