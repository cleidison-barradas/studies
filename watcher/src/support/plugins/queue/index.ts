import * as amqp from 'amqplib'
import { EventEmitter } from 'events'
import { SearchCaptureEvent, AttractionCaptureEvent, StarCaptureEvent } from '../../interfaces/EventsContent'
import config from '../../../config/queue'

export interface EventListener {
  tag: string,
  routingKey: string,
  properties: object,
  content: object | string | null
}

// Typing events
export declare interface AMQP {
  on(event: string, listener: (data: EventListener) => void),
  on(event: 'search-capture', listener: (data: EventListener & SearchCaptureEvent) => void),
  on(event: 'attraction-capture', listener: (data: EventListener & AttractionCaptureEvent) => void),
  on(event: 'star-capture', listener: (data: EventListener & StarCaptureEvent) => void),
  on(event: 'superstar-capture', listener: (data: EventListener & StarCaptureEvent) => void)
}

export class AMQP extends EventEmitter {
  // Singleton
  private static _instance: AMQP
  public static getInstance() {
    if (!AMQP._instance) {
      AMQP._instance = new AMQP()
    }

    return AMQP._instance
  }

  private connection: amqp.Connection

  private constructor() {
    super()
  }

  /**
   * Initialize connection
   */
  public async init() {
    this.connection = await amqp.connect(`${config.amqpHost}?heartbeat=60`)
  }

  /**
   * Start consuming and receiving queue
   * 
   * @param channelName 
   */
  public async start(channelName: string)  {
    if (!this.connection) throw new Error('AMQP: Connection not estabilished!')

    const channel = await this.connection.createConfirmChannel()
    await channel.assertQueue(channelName)

    // Start consuming
    channel.consume(channelName, (msg) => {
      if (msg !== null) {
        const { fields, properties, content } = msg
        this.emit(channelName, {
          tag: fields.deliveryTag,
          routingKey: fields.routingKey,
          properties,
          content: this.parser(content.toString())
        })
        // Ack to provider
        channel.ack(msg)
      }
    })
  }

  /**
   * Parsing data
   * 
   * @param content 
   */
  private parser(content: any) {
    if (!content) return content

    try {
      return JSON.parse(content)
    } catch {
      return content
    }
  }
}
