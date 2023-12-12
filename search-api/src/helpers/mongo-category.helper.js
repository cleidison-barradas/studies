const { ORM, ProductRepository, StoreRepository, Product, Store } = require('@mypharma/api-core')
const { ObjectID } = require('bson')
const getPmcProduct = require('./getPmcProduct')

const retrive = async (categoryId, tenant, start, end) => {
  await ORM.setup(null, tenant)

  return ProductRepository.repo(tenant).findAndCount({
    where: {
      status: true,
      quantity: { $gt: 0 },
      'category._id': new ObjectID(categoryId)
    },
    take: (end - start) + 1,
    skip: start,
    order: { quantity: -1 }
  })
}

/**
 * 
 * @param {Product} products 
 * @param {Store} store 
 */
const normalizeProductsFields = (products = [], store) => {
  const result = new Map([])

  for (let product of products) {
    product.slug = product.slug.pop()

    if (!result.has(product._id)) {
      const { specials, price } = getPmcProduct(product, store)

      product.specials = specials
      product.price = price

      result.set(product._id, {
        ...product
      })
    }
  }
  return result
}

module.exports = async (categoryId, tenant, storeId, start, end) => {
  try {
    const products = []
    const store = await StoreRepository.repo().findById(storeId)
    const [results, total] = await retrive(categoryId, tenant, start, end)

    const normalized = normalizeProductsFields(results, store)

    normalized.forEach(product => products.push(product))

    return {
      total,
      products
    }

  } catch (error) {
    console.log(error)
    return {
      products: [],
      total: 0
    }
  }
}