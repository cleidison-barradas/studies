import { colors, logger, ORM } from "@mypharma/api-core"
import Cluster, { Worker } from "cluster"
import { cpus } from 'os'
import { groupData } from "../../domains/product/helpers/group"
import { reindexProduct } from "../../domains/product/helpers/reindex"
import { QueuePlugin } from "../plugins/queue"

export const IsPrimary = Cluster.isMaster

export interface IQueueDataInvalidate {
  ean: string
  tenant: string
}

export interface IQueueData {
  data: IQueueDataInvalidate[],
  msg: Record<string, any>
}

export class WorkerQueue {
  private cpuCount: number
  private busy: number[] = []
  private workers: Worker[] = []

  constructor(cpusCount?: number) {
    this.cpuCount = cpusCount && cpusCount <= cpus().length ? cpusCount : cpus().length

    Cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died. code: ${code} - signal: ${signal}`)

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

  public add(data: IQueueDataInvalidate, msg: Record<string, any>) {
    const workerIndex = this.getFreeWorker()

    if (workerIndex === -1) {
      return false
    }

    this.busy.push(this.workers[workerIndex].process.pid)
    this.workers[workerIndex].send({ data, msg })

    return true
  }

  private async cluster(message: Record<string, any>, workerPid: number) {
    const { msg } = message

    if (msg) {

      await QueuePlugin.ack('mongo-invalidate-product', msg)
    }

    this.busy = this.busy.filter(pid => pid !== workerPid)
  }

  public static async worker(message: IQueueData) {
    const { data = [], msg } = message

    try {
      const groupped = groupData(data)

      if (groupped) {
        const { eans, tenants } = groupped
        const tenant = tenants[0]

        await ORM.setup(null, tenant)

        logger(`worker #${process.pid} start reindex ${eans.length} products on ${tenant}`, colors.FgYellow)
        const reindexed = await reindexProduct(tenant, eans)

        logger(`reindexed ${reindexed} products on ${tenant}`, colors.FgGreen)
        process.send({ msg })

        if (global.gc) {
          console.log(`Worker #${process.pid}: Clearing GC...`)
          global.gc()
        }
      }
    } catch (error) {
      console.log(error)

      process.send({ msg })
    }
  }
}