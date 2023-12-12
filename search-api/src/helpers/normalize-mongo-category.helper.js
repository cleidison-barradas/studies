// Sentry
const Sentry = require('@sentry/node')
// Api Core
const { ORM, ProductRepository, StoreRepository } = require('@mypharma/api-core')
// Parser Product Mongo
const { parserProducts } = require('./normalize-mongo-products.helper')
// Check pmc product price
const getPmcProduct = require('../helpers/getPmcProduct')
// 
const { ObjectId } = require('bson')

const retrive = async (category_id, tenant, storeId, start = 0, end = 50) => {
  await ORM.setup(null, tenant)

  const [products, total] = await ProductRepository.repo(tenant).findAndCount({
    where: {
      status: true,
      "category._id": new ObjectId(category_id),
      quantity: { $gt: 0 }
    },
    take: (end - start) + 1,
    skip: start
  })
  const store = await StoreRepository.repo().findById(storeId)
  const parsedProducts = parserProducts(products, storeId)

  if (parsedProducts.length > 0) {
    for (let item of parsedProducts) {
      const { specials, price } = getPmcProduct(item, store)
      item.specials = specials
      item.price = price
    }
  }
  return { parsedProducts, total }
}

module.exports = async (category_id, tenant, storeId, start, end) => {
  try {
    let { parsedProducts, total } = await retrive(category_id, tenant, storeId, start, end)

    parsedProducts = parsedProducts.sort((a, b) => {

      return b.quantity - a.quantity
    })

    return { parsedProducts, total }

  } catch (error) {
    console.log(error)
    Sentry.captureException(err)
    return { parsedProducts: [], total: 0 }
  }
}