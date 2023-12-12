import 'dotenv/config'
import { colors, logger, ORM } from '@mypharma/api-core'
import { productService } from './domains/products/services/ProductService'
import { CacheEngineQueue, QueuePlugin } from './support/plugins/queue'
import database from './config/database'
import queue from './config/queue'

export default (async () => {
  try {
    ORM.config = database
    await ORM.setup()

    // Init queue
    await QueuePlugin.init(queue.main)
    await CacheEngineQueue.init(queue.cacheEngine)
    console.log('AMQP initialized!')

    // Start node publish channel
    await CacheEngineQueue.start('mongo-invalidate-product')
    await QueuePlugin.start('etl-api-extractor-products', 'manual')

    productService()

    logger('ETL extractor initialized!', colors.FgGreen)


  } catch (error) {
    console.log(error)
    console.log('Failure on start ETL extractor services!')
  }
})()