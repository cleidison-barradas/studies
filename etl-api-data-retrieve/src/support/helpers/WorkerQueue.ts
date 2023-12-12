import { ISocketRedisData, QueuePlugin, RedisPlugin, socketMountPlainTextData } from '@mypharma/etl-engine'
import Cluster, { Worker } from 'cluster'
import { cpus } from 'os'
import { getProductCache } from '../../domains/product/helpers/cache/ProductCache'

export const isMaster = Cluster.isPrimary
export interface IETLRetrieveData {
  node: string
  redisKey: string,
  msg: Record<any, any>
  nodeOrigin?: string
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

  public add(redisKey: string, node: string, msg: any, nodeOrigin?: string) {
    const workerIndex = this.getFreeWorker()

    if (workerIndex === -1) {
      return false
    }

    this.busy.push(this.workers[workerIndex].process.pid)
    this.workers[workerIndex].send({ redisKey, node, msg, nodeOrigin })

    return true
  }

  private async cluster(message: Record<string, any>, workerPid: number) {
    const { redisKey, node, msg, nodeOrigin = undefined } = message

    // Once the products are cached we can ack this msg and queue to the connection handler send the products
    await QueuePlugin.ack('retrieve-products', msg)
    await QueuePlugin.publish('send-products', { redisKey }, nodeOrigin ? nodeOrigin : node)

    this.busy = this.busy.filter(pid => pid !== workerPid)
  }

  public static async worker({ redisKey, node, msg, nodeOrigin }: IETLRetrieveData) {
    try {
      // Grab socket connection
      let connection: ISocketRedisData = await RedisPlugin.hget(redisKey)

      // If we did not find the connection on redis, we should already ack this item
      if (!connection) {

        throw new Error(`etl_${redisKey}_connection_not_found`)
      }

      // Connection found :D
      if (connection.currentEvent) {
        const { name } = connection.currentEvent

        if (name === 'sync-products') {
          console.log(`Worker #${process.pid}: processing storeId: ${connection.storeId}`)

          // now we make sure our products are cached for this store connection
          let products = await getProductCache(Number(connection.storeId))

          // Parser data
          connection.response = socketMountPlainTextData({
            event: 'sync-products',
            data: {
              products,
              total: products.length
            }
          })

          // Save redis socket connection
          await RedisPlugin.hset(redisKey, connection as any)

          // Free memory
          products = null

        }
      }
      // Free connection
      connection = null

      if (global.gc) {
        console.log(`Worker #${process.pid}: Clearing GC...`)
        global.gc()
      }

      process.send({
        msg,
        node,
        redisKey,
        nodeOrigin
      })

    } catch (error) {
      console.log(error)
      process.send({ msg, node, redisKey, nodeOrigin })
    }
  }
}