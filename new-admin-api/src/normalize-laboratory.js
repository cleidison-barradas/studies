require('dotenv').config()
const { QueuePlugin, ORM, StoreRepository, ProductRepository, ManufacturerRepository }= require('@mypharma/api-core')
const { ObjectId } = require('bson')
const Config = require('./config')
const readLineSync = require('readline-sync')

exports.default = ( async () => {
  ORM.config = Config.databases.mongoConfig
  await ORM.setup()

  await QueuePlugin.init(Config.amqpHost)
  await QueuePlugin.start('mongo-invalidate-product')

  const tenant = readLineSync.question('Enter with tenant = ')

  if (!tenant) return

  const store = await StoreRepository.repo().findOne({
    where: { tenant },
    select: ['tenant']
  })

  if (store) {
    await ORM.setup(null, store.tenant)
  
    const products = await ProductRepository.repo(store.tenant).find({
      where: {
        $or: [
          { manufacturer: { $exists: false } },
          { manufacturer: null }
        ]
      }
    })
    
    const EANS = products.map(p => p.EAN.toString())
  
    const productsAdmin = await ProductRepository.repo().find({
      where: {
        EAN: { $in: EANS },
        manufacturer: { $ne: null }
      }
    })
 
    const bulkWrite = []
    const invalidate = []
    console.log(`found ${products.length} without laboratory`)
    for await (const product of products) {
      let manufacturer = null
      const productAdmin = productsAdmin.find(_p => _p.EAN.toString() === product.EAN.toString())
  
      if (productAdmin) {
        const originalId = productAdmin.manufacturer.originalId || 0
  
        if (originalId > 0) {
          manufacturer = await ManufacturerRepository.repo(store.tenant).findOne({ where: { originalId }})
  
          if (!manufacturer) {
            manufacturer = await ManufacturerRepository.repo(store.tenant).createDoc({
              _id: undefined,
              ...productAdmin.manufacturer,
              createdAt: new Date()
            })
          }
  
          manufacturer = {
            ...manufacturer,
            _id: new ObjectId(manufacturer._id)
          }
    
          bulkWrite.push({
            updateOne: {
              filter: {
                _id: new ObjectId(product._id)
              },
              update: {
                '$set': { manufacturer, updatedAt: new Date() }
              }
            }
          })
  
          invalidate.push({
            ean: product.EAN,
            tenant: store.tenant
          })
        }
      }
    }
    if (bulkWrite.length > 0) {
      const response = await ProductRepository.repo(store.tenant).bulkWrite(bulkWrite)
      await QueuePlugin.publish('mongo-invalidate-product', invalidate)
      console.log(`updated ${response.modifiedCount} products laboratory`, store.tenant)
    } else {
      console.log('nothing to do!')
    }
  } else {
    console.log('store not found!')
  }
})()