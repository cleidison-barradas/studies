const Mongo = require('../../../mongoDB')

async function getProducts(tenant, limit = 1000, skip) {
  const ProductSchema = Mongo.getModelByTenant(tenant, 'ProductSchema')
  const totalProducts = await ProductSchema.countDocuments({ originalId: { $exists: true } })

  const total = Math.ceil(totalProducts / limit)

  const products = await ProductSchema.find({
    originalId: { $exists: true }
  }).select('_id originalId EAN').limit(limit).
    skip((skip - 1) * limit)

  return {
    products,
    total
  }
}

function bulkProducts(tenant, data = []) {
  const ProductSchema = Mongo.getModelByTenant(tenant, 'ProductSchema')

  return ProductSchema.bulkWrite(data)
}


module.exports = { getProducts, bulkProducts }
