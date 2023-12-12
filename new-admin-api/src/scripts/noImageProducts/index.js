require('dotenv').config()
const Config = require('../../config')
const {ORM} = require('@mypharma/api-core')
const {findProducts, countDBProducts} = require('./findProducts.js')
const {countProducts} = require('./countProducts.js')
const {sortAndWriteProducts} = require('./sortAndWriteProducts.js')

let skip = 0
let take = 10000

exports.default = (async () => {
    ORM.config = Config.databases.mongoConfig
    await ORM.setup()

    const numberProducts = await countDBProducts()
    do {
    let countedProducts = []
    const dbProducts = await findProducts(skip, take)

      if (dbProducts.length > 0) {
          const eans = dbProducts.map(_p => _p.EAN)

          const data = await countProducts(eans)

          data.forEach(item => countedProducts.push(item))

          await sortAndWriteProducts(countedProducts) 
      }      
      
      skip = skip + take
      countedProducts = []
    } while (skip <= numberProducts)
    
    process.exit(0)
})()