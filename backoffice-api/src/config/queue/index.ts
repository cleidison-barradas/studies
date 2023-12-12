const { AMQP_HOST, AMQP_HOST_GMV } = process.env

export const amqphost =  `${AMQP_HOST}?heartbeat=60`
export const amqphostgmv =  `${AMQP_HOST_GMV}?heartbeat=60`