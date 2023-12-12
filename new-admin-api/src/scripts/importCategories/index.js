require('dotenv').config()
const Config = require('../../config')
// const { xlsx2json } = require('./xlsx2json')
const { ORM, ProductRepository, CategoryRepository } = require('@mypharma/api-core')
const products = require('./data.json')
const { ObjectId } = require('bson')

const _tenant = 'farmaciamorumbi'

exports.default = (async () => {
  ORM.config = Config.databases.mongoConfig
  await ORM.setup()


  await ORM.setup(null, _tenant)
  const bulkWriteProducts = []

  for await (let product of products) {

    let categories = await CategoryRepository.repo(_tenant).find({
      where: {
        name: product.category
      }
    })

    categories = categories.map(c => {
      c._id = new ObjectId(c._id)
      return c
    })

    const category = categories

    bulkWriteProducts.push({
      updateOne: {
        filter: {
          EAN: product.ean
        },
        update: {
          '$set': {
             category,
             updatedAt: new Date()
          }
        }
      }
    })

  }

  const { modifiedCount } = await ProductRepository.repo(_tenant).bulkWrite(bulkWriteProducts)

  console.log("End!", modifiedCount)
})()

// Quando terminar, alertar o cliente para preencher as caterorias
