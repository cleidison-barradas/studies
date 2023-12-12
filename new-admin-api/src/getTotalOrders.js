const fs = require('fs');
require('dotenv').config()
const Config = require('./config')
const { ORM, OrderRepository, StoreRepository, ProductRepository } = require('@mypharma/api-core')

// var stream = fs.createWriteStream('totalOrders.txt', {
//   flags: 'a'
// })

exports.default = (async () => {
  ORM.config = Config.databases.mongoConfig
  await ORM.setup()

  const store = await StoreRepository.repo().findOne({ where: { tenant: 'novamypharma' }, select: ['tenant'] })

  await ORM.setup(null, store.tenant)
  const bulkProducts = []

  const products = await ProductRepository.repo(store.tenant).find({ where: { EAN: { $exists: true } }, select: ['EAN'] })

  const eans = products.map(product => product.EAN)

  const baseProducts = await ProductRepository.repo().find({
    where: {
      EAN: { $in: eans },
      $and: [
        { originalId: { $ne: 0 } },
        { originalId: { $ne: null } }
      ]
    },
    select: ['EAN', 'originalId']
  })

  baseProducts.forEach(_product => {

    const originalId = _product.originalId

    bulkProducts.push({
      updateOne: {
        filter: { EAN: _product.EAN },
        update: {
          '$set': {
            originalId,
            updatedAt: new Date()
          }
        }
      }
    })
  })

  const response = await ProductRepository.repo(store.tenant).bulkWrite(bulkProducts)

  console.log(`updated ${response.modifiedCount} products`)

  process.exit(0)

})()
