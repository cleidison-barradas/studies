const amqp = require('amqplib')
const { EventEmitter } = require('events')
const { amqpHost } = require('../config')

class AMQP extends EventEmitter {
  /**
   * Initialize connection
   */
  async init(channelName) {
    try {
      this.connection = await amqp.connect(amqpHost + '?heartbeat=60')
      this.channel = await this.connection.createConfirmChannel()
      await this.channel.assertQueue(channelName)
    } catch (error) {
      throw error
    }
  }

  async publish(name, content) {
    try {
      await this.channel.publish('', name, Buffer.from(JSON.stringify(content)), { persistent: true })
    } catch (err) {
      console.error("[AMQP] publish", err)
    }
  }
}

module.exports = new AMQP()
