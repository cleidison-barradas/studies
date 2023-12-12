import { ORM, StoreRepository } from '@mypharma/api-core'
import { ISocketRedisData, QueuePlugin, RedisPlugin, socketMountPlainTextData, SocketProductData } from '@mypharma/etl-engine'
import Cluster, { Worker } from 'cluster'
import { cpus } from 'os'
import { filterUniqueProducts } from '../../domains/product/helpers/filters/filterSocketProduct'
import { CreateLog } from '../../domains/product/helpers/log/CreateLog'
import { InvalidateData, productParser, productsFilter, validProducts } from '../../domains/product/helpers/parsers/ProductParser'
import { CacheQueuePlugin } from '../plugins/queue'

export const isMaster = Cluster.isPrimary

export interface IETLConnectionData {
  node: string
  redisKey: string,
  msg: Record<any, any>
  nodeOrigin?: string
  identifier?: string
}

export class WorkerQueue {
  private cpuCount: number
  private busy: number[] = []
  private workers: Worker[] = []

  /**
   * It creates a new instance of the class, and if the cpuCount is not set, it sets it to the number of
   * cpus on the machine
   * @param {number} [cpuCount] - The number of CPUs to use. Defaults to the number of CPUs available on
   * the machine.
   */
  constructor(cpuCount?: number) {
    this.cpuCount = cpuCount && cpuCount <= cpus().length ? cpuCount : cpus().length

    Cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died. code: ${code} - signal: ${signal}`)

      console.log('Forking new worker')

      this.workers = this.workers.filter(w => w.process.pid !== worker.process.pid)
      this.busy = this.busy.filter(pid => pid !== worker.process.pid)
      this.workers.push(Cluster.fork())

      const workerPid = this.workers[this.workers.length - 1].process.pid
      this.workers[this.workers.length - 1].on('message', message => this.cluster(message, workerPid))
    })
  }

  /**
   * It creates a new worker for each CPU core on the machine
   * @returns A promise that resolves to true after 2 seconds.
   */
  public forkWorkers() {
    return new Promise((resolve) => {
      let i = 0
      while (i < this.cpuCount) {
        this.workers.push(Cluster.fork())
        const workerPid = this.workers[i].process.pid
        this.workers[i].on('message', message => this.cluster(message, workerPid))
        console.log(`Created new worker ${i} with PID: ${workerPid}`)

        i++
      }
      setTimeout(() => {
        resolve(true)
      }, 2000)
    })
  }

  /**
   * It returns the index of the first worker that is not busy
   * @returns The index of the first worker that is not busy.
   */
  private getFreeWorker() {
    let workerIndex = -1

    this.workers.forEach((worker, index) => {
      if (!this.busy.includes(worker.process.pid)) {
        workerIndex = index
      }
    })

    return workerIndex
  }

  /**
   * It finds a free worker, sends it a message, and returns true if it was successful
   * @param {string} redisKey - The key to store the message in.
   * @param msg - The message to be sent to the worker.
   * @returns A boolean value.
   */
  public add(redisKey: string, node: string, msg: any, nodeOrigin?: string, identifier?: string) {
    const workerIndex = this.getFreeWorker()

    if (workerIndex === -1) {
      return false
    }

    this.busy.push(this.workers[workerIndex].process.pid)
    this.workers[workerIndex].send({ redisKey, node, msg, nodeOrigin, identifier })

    return true
  }

  /**
   * It takes a message from a worker, and executes the method that the worker requested
   * @param message - The message sent from the master process.
   * @param {number} workerPid - The process id of the worker that is calling the method.
   */
  private async cluster(message: Record<string, any>, workerPid: number) {
    const { redisKey, node, msg, invalidate, nodeOrigin = undefined } = message

    if (invalidate && invalidate.length > 0) {

      await CacheQueuePlugin.publish('mongo-invalidate-product', invalidate)
    }

    if (msg) {
      // Once the products are cached we can ack this msg and queue to the connection handler send the products
      await QueuePlugin.ack('mongo-persist-products', msg)
      await QueuePlugin.publish('persisted-products', { redisKey }, nodeOrigin ? nodeOrigin : node)
    }

    this.busy = this.busy.filter(pid => pid !== workerPid)
  }

  public static async worker({ redisKey, node, msg, nodeOrigin, identifier }: IETLConnectionData) {
    // Grab socket connection
    let connection: ISocketRedisData = await RedisPlugin.hget(redisKey)

    try {

      if (!connection || !connection.currentEvent) {

        throw new Error('etl_connection_not_found')
      }

      const { name, data } = connection.currentEvent

      const originalId = identifier ? Number(identifier) : Number(connection.storeId)

      if (!originalId) {

        throw new Error('store_id_not_provided')
      }

      const store = await StoreRepository.repo().findOne({
        where: {
          originalId
        }
      })

      if (!store) {

        throw new Error(`store_id_${originalId}_not_found`)
      }

      let invalidate: InvalidateData[] = []

      if (name === 'send-products' && data?.products && data.products.length > 0) {
        // Setup connection
        await ORM.setup(null, store.tenant)
        const socketProductData = filterUniqueProducts(data.products)

        const totalReceived = socketProductData.length

        console.log(`Worker #${process.pid}: Processing ${totalReceived} from ${store.tenant}`)

        do {
          const products = socketProductData.splice(0, 1000)

          let processed = await productParser(products, store)

          invalidate.push(...processed)

          processed = null

        } while (socketProductData.length > 0)

        console.log(`Worker #${process.pid}: Processed ${invalidate.length} of ${totalReceived} from ${store.tenant}`)

        // Parser response
        connection.response = socketMountPlainTextData({
          event: 'received-products',
          data: {
            totalAdded: invalidate.length
          }
        })

        // Save redis socket connection
        await RedisPlugin.hset(redisKey, connection as any)

        if (invalidate.length > 0) {

          await CreateLog(store, connection.userId, invalidate.length)
        }
      }
      // Free memory
      connection = null

      if (global.gc) {
        console.log(`Worker #${process.pid}: Clearing GC...`)
        global.gc()
      }

      process.send({
        msg,
        node,
        redisKey,
        invalidate,
        nodeOrigin
      })

    } catch (error) {
      console.log(error)

      connection.response = socketMountPlainTextData({
        event: 'received-products',
        data: {
          totalAdded: 0
        }
      })

      await RedisPlugin.hset(redisKey, connection as any)

      process.send({ redisKey, node, msg, nodeOrigin })
    }
  }
}