import { colors, logger, ORM, StoreRepository } from "@mypharma/api-core"
import Cluster, { Worker } from "cluster"
import { cpus } from "os"

import { CacheEngineQueue, QueuePlugin } from "../plugins/queue"
import Redis from "../plugins/redis/Redis"

import { productFilter, ProductParser } from "../../domains/products/services/ProductParser"
import { IConnectionData } from "../../interfaces/IConnectionData"
import { IInvalidate } from "../../interfaces/IValidateProduct"

export const isCluster = Cluster.isPrimary

export interface RedisConnection {
  redisKey: string
  msg: any
}

interface RedisContent {
  tenant: string
  userId: string
  products: IConnectionData[]
}

export class WorkerQueue {
  private cpuCount: number

  private workers: Worker[] = []
  private busy: number[] = []

  constructor(cpuCount?: number) {

    this.cpuCount =
      cpuCount && cpuCount <= cpus().length ? cpuCount : cpus().length

    Cluster.on("exit", (worker, code, signal) => {
      console.log(
        `Worker ${worker.process.pid} died. code: ${code} - signal: ${signal}`
      )
      console.log("Forking new worker")

      this.workers = this.workers.filter(
        (p) => p.process.pid !== worker.process.pid
      )
      this.busy = this.busy.filter((pid) => pid !== worker.process.pid)
      this.workers.push(Cluster.fork())

      // Listen event again :P
      const workerPid = this.workers[this.workers.length - 1].process.pid
      this.workers[this.workers.length - 1].on("message", (message) =>
        this.cluster(message, workerPid)
      )
    })
  }

  public forkWorkers() {
    return new Promise((resolve) => {
      let i = 0
      while (i < this.cpuCount) {
        this.workers.push(Cluster.fork())

        const workerPid = this.workers[i].process.pid
        this.workers[i].on("message", (message) =>
          this.cluster(message, workerPid)
        )
        console.log(`Created worker #${i} with PID: ${workerPid}`)

        i++
      }

      setTimeout(() => {
        resolve(true)
      }, 2000)
    })
  }

  public add(redisKey: string, msg: any) {
    const workerIndex = this.getFreeWorker()

    if (workerIndex === -1) {
      return false
    }

    this.busy.push(this.workers[workerIndex].process.pid)
    this.workers[workerIndex].send({ redisKey, msg })

    return true
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

  private async cluster(message: any, workerPid: number) {
    const { msg, invalidate = [] } = message

    if (msg) {

      if (invalidate && invalidate.length > 0) {

        await CacheEngineQueue.publish('mongo-invalidate-product', invalidate)
      }

      await QueuePlugin.ack('etl-api-extractor-products', msg)
      logger(`worker #${workerPid} finalized`, colors.FgYellow)
    }

    this.busy = this.busy.filter((pid) => pid !== workerPid)
  }

  public static async worker({ redisKey, msg }: RedisConnection) {
    try {

      let invalidate: IInvalidate[] = []
      const data = await Redis.get<RedisContent>(redisKey)

      if (data) {
        const { tenant, products, userId } = data

        const store = await StoreRepository.repo().findOne({ tenant })

        if (!store) {

          throw new Error('store_not_found')
        }

        await ORM.setup(null, tenant)
        const totalReceived = products.length

        const eans = products.map(_p => String(_p.EAN))

        let { replicas, valids } = await productFilter(eans, tenant)

        logger(`worker #${process.pid} processing ${totalReceived} on ${tenant}`, colors.FgYellow)

        do {
          const processing = products.splice(0, 1000)

          const processed = await ProductParser(processing, valids, replicas, store, userId)

          invalidate.push(...processed)

        } while (products.length > 0)

        console.log(`Worker #${process.pid}: Processed ${invalidate.length} of ${totalReceived} from ${store.tenant}`)
      }

      if (global.gc) {
        console.log(`Worker #${process.pid}: Clearing GC...`)
        global.gc()
      }

      await Redis.del(redisKey)

      process.send({ msg, invalidate })

      invalidate = []

    } catch (error) {
      console.log(error)
      process.send({ msg })
    }
  }
}
