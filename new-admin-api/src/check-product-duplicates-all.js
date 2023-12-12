require('dotenv').config()
const Config = require('./config')
const { ObjectId } = require('bson')
const { logger, constants: { Color } } = require('./utils')
const { ORM, ProductRepository, StoreRepository } = require('@mypharma/api-core')
const mongoose = require('mongoose')

// não pedir ID da loja
// percorrer loja a loja
// nome + quantos duplicados
// gerar scripts

const validateId = _id => mongoose.Types.ObjectId.isValid(_id)

exports.default = (async () => {
  ORM.config = Config.databases.mongoConfig
  await ORM.setup()
  const stores = await StoreRepository.repo().find({
    select: ['originalId', 'tenant', 'name']
  })

  for await (const store of stores) {
    console.log("=========================================")
    await ORM.setup(null, store.tenant)
    const productIds = []

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
      console.log("Loja: ", store.name)
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
          const productInfo = configuredProducts.find(p => !p.image)

          if (productInfo && productInfo._id && validateId(productInfo._id)) {

            productIds.push(new ObjectId(productInfo._id))
          }

        } else if (configuredProducts.filter(p => !p.image).length === Number(total)) {
          const productInfo = configuredProducts[0]

          if (productInfo && productInfo._id && validateId(productInfo._id)) {
            productIds.push(new ObjectId(productInfo._id))
          }

        } else if (configuredProducts.filter(p => typeof p.image === 'object').length === Number(total)) {
          const productInfo = configuredProducts[0]

          if (productInfo && productInfo._id && validateId(productInfo._id)) {
            productIds.push(new ObjectId(productInfo._id))
          }

        } else {
          const productInfo = configuredProducts[0]

          if (productInfo && productInfo._id && validateId(productInfo._id)) {
            productIds.push(new ObjectId(productInfo._id))
          }
        }
      })

      if (productIds.length > 0) {
        await ProductRepository.repo(store.tenant).deleteMany({ _id: { $in: productIds } })
        logger(`removed ${productIds.length} products duplicates`, Color.FgYellow)
      }

    } else {
      logger('duplicate_eans_not_found', Color.FgRed)
    }

  }
  console.log("=========================================")
})()
