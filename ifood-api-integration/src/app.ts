import 'dotenv/config'
import { cpus } from 'os'
import { colors, logger, ORM } from "@mypharma/api-core"
import { RedisPlugin } from '@mypharma/etl-engine'

import { productService } from './domains/product/services/ProductService'
import { MainQueuePlugin } from './support/plugins/queue'

import databaseConfig from "./config/database"
import queueConfig from './config/queue'
import redisConfig from './config/redis'
import { isMaster, IWorkerData, WorkerQueue } from './support/helpers/WorkerQueue'

export default (async () => {
  try {
    ORM.config = databaseConfig
    await ORM.setup()
    logger('[MONGO] database initialized!', colors.FgCyan)

    RedisPlugin.init(redisConfig)
    logger('[REDIS] database initialized!', colors.FgCyan)

    if (isMaster) {
      // init queues
      await MainQueuePlugin.init(queueConfig.main)

      await MainQueuePlugin.start('ifood-retrieve-products', 'manual', queueConfig.node)
      logger('[RABBITMQ] queue initialized!', colors.FgCyan)

      setTimeout(async () => {
        const workerQueue = new WorkerQueue(cpus().length)
        await workerQueue.forkWorkers()

        // Start services
        productService(workerQueue)

        logger(`Ifood services initialized on node: ${queueConfig.node}`, colors.FgGreen)

      }, 10000)

    } else {
      process.on('message', (message: IWorkerData) => WorkerQueue.worker(message))
    }

  } catch (error) {
    console.log(error)
    logger('Failure on initialized ifood services!', colors.FgRed)
  }
})();
