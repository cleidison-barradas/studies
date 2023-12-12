// Redis lib
const Redis = require('ioredis')

// Config
const { redisConfig } = require('../config')

// Redis client
const client = new Redis(redisConfig)

const getProduct = async ({ productId }) => {
  if (Number(productId) <= 0) throw Error('Invalid ID')
  const result = await client.get(`product_${productId}`)
  let product = null
  try {
    product = JSON.parse(result)
  } catch {
    product = null
  } finally {
    return product
  }
}

const getCategory = ({ categoryId, storeId, start = 0, end = 50}) => {
  if (Number(categoryId) <= 0) throw Error('Invalid Category ID')

  if (!start) {
    start = 0
  }
  if (!end) {
    end = 50
  }

  return client.lrange(`category_${storeId}_${categoryId}`, Number(start), Number(end))
}

const countCategory = ({ categoryId, storeId }) => {
  if (Number(categoryId) <= 0) throw Error('Invalid Category ID')

  return client.llen(`category_${storeId}_${categoryId}`)
}

module.exports = {
  getProduct,

  getCategory,
  countCategory
}
