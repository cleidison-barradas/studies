import Cluster, { Worker } from 'cluster'
import { cpus } from 'os'
import { ORM, colors, logger } from '@mypharma/api-core'
import { RedisPlugin } from '@mypharma/etl-engine'
import moment from 'moment'

import { IfoodConnection } from '../../interfaces/ifoodProductsKey'

import StoreGetStoreByTenantService from '../../domains/store/services/StoreGetStoreByTenantService'
import { handleProduct } from '../../domains/product/services/HandleIfoodProducts'
import { MainQueuePlugin } from '../plugins/queue'

const storeGetStoreByTenantService = new StoreGetStoreByTenantService()

export const isMaster = Cluster.isPrimary

export interface IWorkerData {
  msg: any
  node: string
  redisKey: string
  nodeOrigin?: string
}

export class WorkerQueue {
  private cpuCount: number
  private busy: number[] = []
  private workers: Worker[] = []

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

  private async cluster(message: IWorkerData, workerPid: number) {
    const { msg } = message

    await MainQueuePlugin.ack('ifood-retrieve-products', msg)

    this.busy = this.busy.filter(pid => pid !== workerPid)
  }

  public static async worker({ redisKey, node, msg, nodeOrigin }: IWorkerData) {

    try {

      if (!redisKey) {

        throw new Error('missing_redis_key')
      }

      let connection: IfoodConnection | null = await RedisPlugin.hget(redisKey)

      if (!connection) {

        throw new Error('connection_not_found')
      }

      const tenant = connection.tenant

      const store = await storeGetStoreByTenantService.getStoreByTenant({ tenant })
      await ORM.setup(null, tenant)

      logger(`Worker #${process.pid} Processing on ${tenant}`, colors.FgYellow)

      await handleProduct(connection, store)

      connection = {
        ...connection,
        event: 'finalized',
        lastUpdated: moment().add(30, 'minutes').toISOString()
      }

      // Remove old connection
      await RedisPlugin.remove(redisKey)

      // Set updated connection
      await RedisPlugin.hset(redisKey, connection as any)

      // Close db connection
      await ORM.closeConnection(store.tenant)

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
      await RedisPlugin.expireAt(redisKey, 60 * 2)

      process.send({
        msg,
        node,
        redisKey,
        nodeOrigin
      })
    }
  }
}