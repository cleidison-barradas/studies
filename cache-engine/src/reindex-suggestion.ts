// Load envs
require('dotenv').config()
// Avoid ElasticSearch TLS error
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

import { ORM, StoreRepository, ProductRepository } from '@mypharma/api-core'
// Config
import databaseConfig from './config/database'
import queueConfig from './config/queue'
// Elasticsearch
import elasticsearch from './support/plugins/elasticsearch'
import { QueuePlugin } from './support/plugins/queue'

export default (async () => {
  // Setup ORM
  ORM.config = databaseConfig.mongoConnection
  await ORM.setup()
  console.log('MongoDB ORM initialized!')

  await QueuePlugin.init(queueConfig)
  console.log('AMQP initialized!')

  // Now we can start to consuming our queue :D
  await QueuePlugin.start('mongo-invalidate-suggest-product')
  console.log(`Started consuming online queue !`)

  console.log('Fetching stores...')
  const stores = await StoreRepository.repo().find({
    select: ['tenant']
  })

  console.log('Checking stores indices...')

  for await (const store of stores) {
    if (store.tenant) {

      const exists = await elasticsearch.exists({
        prefix: 'mongo_store_suggest',
        id: process.env.NODE_ENV
      })

      if (!exists) {

        await elasticsearch.create({ prefix: 'mongo_store_suggest', id: process.env.NODE_ENV }, {})
      }

      await ORM.setup(null, store.tenant)

      const products = await ProductRepository.repo(store.tenant).find({
        select: ['EAN']
      })

      if (products.length > 0) {
        const invalidations = products.map(v => {
          return {
            ean: v.EAN,
            tenant: store.tenant
          }
        })

        console.log(`Invalidating ${invalidations.length}`)
        await QueuePlugin.publish('mongo-invalidate-suggest-product', invalidations)
      }
    }
  }
})()
