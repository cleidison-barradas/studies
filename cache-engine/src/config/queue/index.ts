const {
  AMQP_HOST
} = process.env

export default `${AMQP_HOST}?heartbeat=60`
