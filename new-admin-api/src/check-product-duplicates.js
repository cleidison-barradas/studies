require('dotenv').config()
const rd = require('readline')
const Config = require('./config')
const { ObjectID } = require('bson')
const { logger, constants: { Color } } = require('./utils')
const { ORM, ProductRepository, StoreRepository } = require('@mypharma/api-core')

// não pedir ID da loja
// percorrer loja a loja
// nome + quantos duplicados
// gerar scripts

const task = rd.createInterface({
  input: process.stdin,
  output: process.stdout
})

exports.default = (async () => {
  ORM.config = Config.databases.mongoConfig
  await ORM.setup()
  const productIds = []

  task.question('Enter with storeId = ', async (storeId = '') => {
    const isvalid = ObjectID.isValid(storeId)

    if (isvalid) {
      const store = await StoreRepository.repo().findById(ObjectID(storeId))

      if (store) {
        await ORM.setup(null, store.tenant)

        const results = await ProductRepository.repo(store.tenant).aggregate([
          {
            "$group": {
              "_id": { "EAN": "$EAN" },
              "product_ids": { "$addToSet": "$_id" },
              "total": { "$sum": 1 }
            }
          },
          { "$match": { "total": { "$gt": 1 } } }
        ]).toArray()

        if (results.length > 0) {

          logger(`Found ${results.length} EANs with duplicates !`, Color.FgGreen)
          const EANs = results.map(res => res._id.EAN)

          const products = await ProductRepository.repo(store.tenant).find({
            where: {
              EAN: { $in: EANs }
            }
          })

          results.map(res => {
            const { _id: { EAN }, total } = res

            const configuredProducts = products.filter(product => product.EAN === EAN || product.EAN === null || product.EAN === undefined)

            if (configuredProducts.filter(p => !p.image).length === 1) {
              productIds.push(new ObjectID(configuredProducts.find(p => !p.image)._id))

            } else if (configuredProducts.filter(p => !p.image).length === Number(total)) {
              productIds.push(new ObjectID(configuredProducts[0]._id))

            } else if (configuredProducts.filter(p => typeof p.image === 'object').length === Number(total)) {
              productIds.push(new ObjectID(configuredProducts[0]._id))
            } else {
              productIds.push(new ObjectID(configuredProducts[0]._id))

            }
          })

          if (productIds.length > 0) {
            await ProductRepository.repo(store.tenant).deleteMany({ _id: { $in: productIds } })
            logger(`removed ${productIds.length} products duplicates`, Color.FgYellow)
          }

        } else {
          logger('duplicate_eans_not_found', Color.FgRed)
        }

      } else {
        logger('store_not_found', Color.FgRed)
        task.close()
      }
    } else {
      logger('store_id_invalid', Color.FgRed)
    }
  })

})()
