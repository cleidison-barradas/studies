import amqp = require('amqplib')
import { EventEmitter } from 'events'
const { AMQP_HOST } = process.env

class AMQP extends EventEmitter {
  connection: any
  channel: any

  /**
   * Initialize connection
   */
  async init(channelName: string) {
    try {
      this.connection = await amqp.connect(AMQP_HOST + '?heartbeat=60')
      this.channel = await this.connection.createConfirmChannel()
      await this.channel.assertQueue(channelName)
    } catch (error) {
      throw error
    }
  }

  async publish(name: string, content: any) {
    try {
      await this.channel.publish('', name, Buffer.from(JSON.stringify(content)), { persistent: true })
    } catch (err) {
      console.error('[AMQP] publish', err)
    }
  }
}

export default new AMQP()
