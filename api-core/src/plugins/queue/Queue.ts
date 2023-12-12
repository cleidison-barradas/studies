import * as amqplib from 'amqplib'
import { EventEmitter } from 'events'
import { GenericObject } from '../../interfaces/generics/GenericObject'
import { IEventListener } from '../../interfaces/queue/EventListener'

// Typing events
declare interface AMQP {
  on(event: string, listener: (data: IEventListener) => void),
}

class AMQP extends EventEmitter {
  private connection: amqplib.Connection
  private channels: amqplib.Channel[] | amqplib.ConfirmChannel[] = []

  public async init(connectionString: string) {
    this.connection = await amqplib.connect(connectionString)
  }

  public async start(channelName: string, type: 'confirmation' | 'manual' = 'confirmation') {
    if (!this.connection) throw new Error('AMQP: Connection not estabilished!')
    if (this.channels[channelName]) {
      await this.channels[channelName].close()
    }

    if (type === 'manual') {
      this.channels[channelName] = await this.connection.createChannel()
    } else {
      this.channels[channelName] = await this.connection.createConfirmChannel()
    }

    await this.channels[channelName].assertQueue(channelName)
  }

  public async consume(channelName: string) {
    if (!this.channels[channelName]) throw new Error('AMQP: Channel not started')

    // Start consuming
    this.channels[channelName].consume(channelName, (msg) => {
      if (msg !== null) {
        const { fields, properties, content } = msg
        this.emit(channelName, {
          data: {
            tag: fields.deliveryTag,
            routingKey: fields.routingKey,
            properties,
            content: this.parser(content.toString())
          },
          msg
        })
      }
    })
  }

  public async publish(channelName: string, content: GenericObject | string | number) {
    if (!this.channels[channelName]) throw new Error('AMQP: Channel not started')

    await this.channels[channelName].publish('', channelName, Buffer.from(JSON.stringify(content)), { persistent: true })
  }

  public async ack(channelName: string, msg: GenericObject) {
    if (this.channels[channelName]) {
      // Ack to provider
      this.channels[channelName].ack(msg)
    }
  }

  private parser(content: string | null | undefined) {
    if (!content) return content

    try {
      return JSON.parse(content)
    } catch {
      return content
    }
  }
}

export const QueuePlugin = new AMQP()
